(function () {
'use strict';

const createTextVNode = value => ({
	nodeType: 'Text',
	children: [],
	props: {value},
	lifeCycle: 0
});

const normalize = (children, currentText = '', normalized = []) => {
	if (children.length === 0) {
		if (currentText) {
			normalized.push(createTextVNode(currentText));
		}
		return normalized;
	}

	const child = children.shift();
	const type = typeof child;
	if (type === 'object' || type === 'function') {
		if (currentText) {
			normalized.push(createTextVNode(currentText));
			currentText = '';
		}
		normalized.push(child);
	} else {
		currentText += child;
	}

	return normalize(children, currentText, normalized);
};

/**
 * Transform hyperscript into virtual dom node
 * @param nodeType {Function, String} - the HTML tag if string, a component or combinator otherwise
 * @param props {Object} - the list of properties/attributes associated to the related node
 * @param children - the virtual dom nodes related to the current node children
 * @returns {Object} - a virtual dom node
 */
function h(nodeType, props, ...children) {
	const flatChildren = [];
	for (const c of children) {
		if (Array.isArray(c)) {
			flatChildren.push(...c);
		} else {
			flatChildren.push(c);
		}
	}

	const normalizedChildren = normalize(flatChildren);

	if (typeof nodeType !== 'function') { // Regular html/text node
		return {
			nodeType,
			props,
			children: normalizedChildren,
			lifeCycle: 0
		};
	}

	const fullProps = Object.assign({children: normalizedChildren}, props);
	const comp = nodeType(fullProps);
	const compType = typeof comp;
	return compType !== 'function' ? comp : h(comp, props, ...normalizedChildren); // Functional comp vs combinator (HOC)
}

const swap = f => (a, b) => f(b, a);

const compose = (first, ...fns) => (...args) => fns.reduce((previous, current) => current(previous), first(...args));

const curry = (fn, arityLeft) => {
	const arity = arityLeft || fn.length;
	return (...args) => {
		const argLength = args.length || 1;
		if (arity === argLength) {
			return fn(...args);
		}
		const func = (...moreArgs) => fn(...args, ...moreArgs);
		return curry(func, arity - args.length);
	};
};

const tap = fn => arg => {
	fn(arg);
	return arg;
};

const nextTick = fn => setTimeout(fn, 0);

const pairify = holder => key => [key, holder[key]];

const isShallowEqual = (a, b) => {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	return aKeys.length === bKeys.length && aKeys.every(k => a[k] === b[k]);
};

const ownKeys = obj => Object.getOwnPropertyNames(obj);

const isDeepEqual = (a, b) => {
	const type = typeof a;
	const typeB = typeof b;

	// Short path(s)
	if (a === b) {
		return true;
	}

	if (type !== typeB) {
		return false;
	}

	if (type !== 'object') {
		return a === b;
	}

	// Objects ...
	if (a === null || b === null) {
		return false;
	}

	if (Array.isArray(a)) {
		return a.length && b.length && a.every((item, i) => isDeepEqual(a[i], b[i]));
	}

	const aKeys = ownKeys(a);
	const bKeys = ownKeys(b);
	return aKeys.length === bKeys.length && aKeys.every(k => isDeepEqual(a[k], b[k]));
};

const identity = a => a;

const noop = () => {};

const SVG_NP = 'http://www.w3.org/2000/svg';

const updateDomNodeFactory = method => items => tap(domNode => {
	for (const pair of items) {
		domNode[method](...pair);
	}
});

const removeEventListeners = updateDomNodeFactory('removeEventListener');

const addEventListeners = updateDomNodeFactory('addEventListener');

const setAttributes = items => tap(domNode => {
	const attributes = items.filter(pair => typeof pair.value !== 'function');
	for (const [key, value] of attributes) {
		if (value === false) {
			domNode.removeAttribute(key);
		} else {
			domNode.setAttribute(key, value);
		}
	}
});

const removeAttributes = items => tap(domNode => {
	for (const attr of items) {
		domNode.removeAttribute(attr);
	}
});

const setTextNode = val => node => {
	node.textContent = val;
};

const createDomNode = (vnode, parent) => {
	if (vnode.nodeType === 'svg') {
		return document.createElementNS(SVG_NP, vnode.nodeType);
	} else if (vnode.nodeType === 'Text') {
		return document.createTextNode(vnode.nodeType);
	}
	return parent.namespaceURI === SVG_NP ?
		document.createElementNS(SVG_NP, vnode.nodeType) :
		document.createElement(vnode.nodeType);
};

const getEventListeners = props => Object.keys(props)
	.filter(k => k.substr(0, 2) === 'on')
	.map(k => [k.substr(2).toLowerCase(), props[k]]);

function * traverse(vnode) {
	yield vnode;
	if (vnode.children && vnode.children.length > 0) {
		for (const child of vnode.children) {
			yield * traverse(child);
		}
	}
}

const updateEventListeners = ({props: newNodeProps} = {}, {props: oldNodeProps} = {}) => {
	const newNodeEvents = getEventListeners(newNodeProps || {});
	const oldNodeEvents = getEventListeners(oldNodeProps || {});

	return newNodeEvents.length || oldNodeEvents.length ?
		compose(
			removeEventListeners(oldNodeEvents),
			addEventListeners(newNodeEvents)
		) : noop;
};

const updateAttributes = (newVNode, oldVNode) => {
	const newVNodeProps = newVNode.props || {};
	const oldVNodeProps = oldVNode.props || {};

	if (isShallowEqual(newVNodeProps, oldVNodeProps)) {
		return noop;
	}

	if (newVNode.nodeType === 'Text') {
		return setTextNode(newVNode.props.value);
	}

	const newNodeKeys = Object.keys(newVNodeProps);
	const oldNodeKeys = Object.keys(oldVNodeProps);
	const attributesToRemove = oldNodeKeys.filter(k => !newNodeKeys.includes(k));

	return compose(
		removeAttributes(attributesToRemove),
		setAttributes(newNodeKeys.map(pairify(newVNodeProps)))
	);
};

const domFactory = createDomNode;

// Apply vnode diffing to actual dom node (if new node => it will be mounted into the parent)
const domify = (oldVnode, newVnode, parentDomNode) => {
	if (!oldVnode && newVnode) { // There is no previous vnode
		newVnode.dom = parentDomNode.appendChild(domFactory(newVnode, parentDomNode));
		newVnode.lifeCycle = 1;
		return {vnode: newVnode, garbage: null};
	}

	// There is a previous vnode
	if (!newVnode) { // We must remove the related dom node
		parentDomNode.removeChild(oldVnode.dom);
		return ({garbage: oldVnode, dom: null});
	} else if (newVnode.nodeType !== oldVnode.nodeType) { // It must be replaced
		newVnode.dom = domFactory(newVnode, parentDomNode);
		newVnode.lifeCycle = 1;
		parentDomNode.replaceChild(newVnode.dom, oldVnode.dom);
		return {garbage: oldVnode, vnode: newVnode};
	}

	// Only update attributes
	newVnode.dom = oldVnode.dom;
	// Pass the unMountHook
	if (oldVnode.onUnMount) {
		newVnode.onUnMount = oldVnode.onUnMount;
	}
	newVnode.lifeCycle = oldVnode.lifeCycle + 1;
	return {garbage: null, vnode: newVnode};
};

/**
 * Render a virtual dom node, diffing it with its previous version, mounting it in a parent dom node
 * @param oldVnode
 * @param newVnode
 * @param parentDomNode
 * @param onNextTick collect operations to be processed on next tick
 * @returns {Array}
 */
const render = (oldVnode, newVnode, parentDomNode, onNextTick = []) => {
	// 1. transform the new vnode to a vnode connected to an actual dom element based on vnode versions diffing
	// 	i. note at this step occur dom insertions/removals
	// 	ii. it may collect sub tree to be dropped (or "unmounted")
	const {vnode, garbage} = domify(oldVnode, newVnode, parentDomNode);

	if (garbage !== null) {
		// Defer unmount lifecycle as it is not "visual"
		for (const g of traverse(garbage)) {
			if (g.onUnMount) {
				onNextTick.push(g.onUnMount);
			}
		}
	}

	// Normalisation of old node (in case of a replace we will consider old node as empty node (no children, no props))
	const tempOldNode = garbage !== null || !oldVnode ? {length: 0, children: [], props: {}} : oldVnode;

	if (vnode) {
		// 2. update dom attributes based on vnode prop diffing.
		// Sync
		if (vnode.onUpdate && vnode.lifeCycle > 1) {
			vnode.onUpdate();
		}

		updateAttributes(vnode, tempOldNode)(vnode.dom);

		// Fast path
		if (vnode.nodeType === 'Text') {
			return onNextTick;
		}

		if (vnode.onMount && vnode.lifeCycle === 1) {
			onNextTick.push(() => vnode.onMount());
		}

		const childrenCount = Math.max(tempOldNode.children.length, vnode.children.length);

		// Async will be deferred as it is not "visual"
		const setListeners = updateEventListeners(vnode, tempOldNode);
		if (setListeners !== noop) {
			onNextTick.push(() => setListeners(vnode.dom));
		}

		// 3. recursively traverse children to update dom and collect functions to process on next tick
		if (childrenCount > 0) {
			for (let i = 0; i < childrenCount; i++) {
				// We pass onNextTick as reference (improve perf: memory + speed)
				render(tempOldNode.children[i], vnode.children[i], vnode.dom, onNextTick);
			}
		}
	}

	return onNextTick;
};

const hydrate = (vnode, dom) => {
	const hydrated = Object.assign({}, vnode);
	const domChildren = Array.from(dom.childNodes).filter(n => n.nodeType !== 3 || n.nodeValue.trim() !== '');
	hydrated.dom = dom;
	hydrated.children = vnode.children.map((child, i) => hydrate(child, domChildren[i]));
	return hydrated;
};

const mount = curry((comp, initProp, root) => {
	const vnode = comp.nodeType !== void 0 ? comp : comp(initProp || {});
	const oldVNode = root.children.length ? hydrate(vnode, root.children[0]) : null;
	const batch = render(oldVNode, vnode, root);
	nextTick(() => {
		for (const op of batch) {
			op();
		}
	});
	return vnode;
});

/**
 * Create a function which will trigger an update of the component with the passed state
 * @param comp {Function} - the component to update
 * @param initialVNode - the initial virtual dom node related to the component (ie once it has been mounted)
 * @returns {Function} - the update function
 */
var update = (comp, initialVNode) => {
	let oldNode = initialVNode;
	return (props, ...args) => {
		const mount$$1 = oldNode.dom.parentNode;
		const newNode = comp(Object.assign({children: oldNode.children || []}, oldNode.props, props), ...args);
		const nextBatch = render(oldNode, newNode, mount$$1);

		// Danger zone !!!!
		// Change by keeping the same reference so the eventual parent node does not need to be "aware" tree may have changed downstream: oldNode may be the child of someone ...(well that is a tree data structure after all :P )
		oldNode = Object.assign(oldNode || {}, newNode);
		// End danger zone

		nextTick(() => {
			for (const op of nextBatch) {
				op();
			}
		});

		return newNode;
	};
};

const lifeCycleFactory = method => curry((fn, comp) => (props, ...args) => {
	const n = comp(props, ...args);
	const applyFn = () => fn(n, ...args);
	const current = n[method];
	n[method] = current ? compose(current, applyFn) : applyFn;
	return n;
});

/**
 * Life cycle: when the component is mounted
 */
const onMount = lifeCycleFactory('onMount');

/**
 * Life cycle: when the component is unmounted
 */
const onUnMount = lifeCycleFactory('onUnMount');

/**
 * Life cycle: before the component is updated
 */
const onUpdate = lifeCycleFactory('onUpdate');

/**
 * Combinator to create a "stateful component": ie it will have its own state and the ability to update its own tree
 * @param comp {Function} - the component
 * @returns {Function} - a new wrapped component
 */
var withState = comp => () => {
	let updateFunc;
	const wrapperComp = (props, ...args) => {
		// Lazy evaluate updateFunc (to make sure it is defined
		const setState = newState => updateFunc(newState);
		return comp(props, setState, ...args);
	};
	const setUpdateFunction = vnode => {
		updateFunc = update(wrapperComp, vnode);
	};

	return compose(onMount(setUpdateFunction), onUpdate(setUpdateFunction))(wrapperComp);
};

const defaultUpdate = (a, b) => isDeepEqual(a, b) === false;

/**
 * Connect combinator: will create "container" component which will subscribe to a Redux like store. and update its children whenever a specific slice of state change under specific circumstances
 * @param store {Object} - The store (implementing the same api than Redux store
 * @param sliceState {Function} [state => state] - A function which takes as argument the state and return a "transformed" state (like partial, etc) relevant to the container
 * @returns {Function} - A container factory with the following arguments:
 *  - mapStateToProp: a function which takes as argument what the "sliceState" function returns and returns an object to be blended into the properties of the component (default to identity function)
 *  - shouldUpdate: a function which takes as arguments the previous and the current versions of what "sliceState" function returns to returns a boolean defining whether the component should be updated (default to a deepEqual check)
 */
var connect = (store, sliceState = identity) =>
	(comp, mapStateToProp = identity, shouldUpate = defaultUpdate) => initProp => {
		const componentProps = initProp;
		let updateFunc;
		let previousStateSlice;
		let unsubscriber;

		const wrapperComp = (props, ...args) => {
			return comp(Object.assign(props, mapStateToProp(sliceState(store.getState()))), ...args);
		};

		const subscribe = onMount(vnode => {
			updateFunc = update(wrapperComp, vnode);
			unsubscriber = store.subscribe(() => {
				const stateSlice = sliceState(store.getState());
				if (shouldUpate(previousStateSlice, stateSlice) === true) {
					Object.assign(componentProps, mapStateToProp(stateSlice));
					updateFunc(componentProps);
					previousStateSlice = stateSlice;
				}
			});
		});

		const unsubscribe = onUnMount(() => {
			unsubscriber();
		});

		return compose(subscribe, unsubscribe)(wrapperComp);
	};

const filterOutFunction = props => Object
	.entries(props || {})
	.filter(([key, value]) => typeof value !== 'function');

const escapeHTML = s => String(s)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');

const render$1 = curry((comp, initProp) => {
	const vnode = comp.nodeType !== void 0 ? comp : comp(initProp || {});
	const {nodeType, children, props} = vnode;
	const attributes = escapeHTML(filterOutFunction(props)
		.map(([key, value]) => typeof value === 'boolean' ? (value === true ? key : '') : `${key}="${value}"`)
		.join(' '));
	const childrenHtml = children !== void 0 && children.length > 0 ? children.map(ch => render$1(ch)()).join('') : '';
	return nodeType === 'Text' ? escapeHTML(String(props.value)) : `<${nodeType}${attributes ? ` ${attributes}` : ''}>${childrenHtml}</${nodeType}>`;
});

function pointer(path) {
	const parts = path.split('.');

	function partial(obj = {}, parts = []) {
		const p = parts.shift();
		const current = obj[p];
		return (current === undefined || parts.length === 0) ?
			current : partial(current, parts);
	}

	function set(target, newTree) {
		let current = target;
		const [leaf, ...intermediate] = parts.reverse();
		for (const key of intermediate.reverse()) {
			if (current[key] === undefined) {
				current[key] = {};
				current = current[key];
			}
		}
		current[leaf] = Object.assign(current[leaf] || {}, newTree);
		return target;
	}

	return {
		get(target) {
			return partial(target, [...parts]);
		},
		set
	};
}

function sortByProperty(prop) {
	const propGetter = pointer(prop).get;
	return (a, b) => {
		const aVal = propGetter(a);
		const bVal = propGetter(b);

		if (aVal === bVal) {
			return 0;
		}

		if (bVal === undefined) {
			return -1;
		}

		if (aVal === undefined) {
			return 1;
		}

		return aVal < bVal ? -1 : 1;
	};
}

function sortFactory({pointer: pointer$$1, direction} = {}) {
	if (!pointer$$1 || direction === 'none') {
		return array => [...array];
	}

	const orderFunc = sortByProperty(pointer$$1);
	const compareFunc = direction === 'desc' ? swap(orderFunc) : orderFunc;

	return array => [...array].sort(compareFunc);
}

function typeExpression(type) {
	switch (type) {
		case 'boolean':
			return Boolean;
		case 'number':
			return Number;
		case 'date':
			return val => new Date(val);
		default:
			return compose(String, val => val.toLowerCase());
	}
}

const not = fn => input => !fn(input);

const is = value => input => Object.is(value, input);
const lt = value => input => input < value;
const gt = value => input => input > value;
const equals = value => input => value === input;
const includes = value => input => input.includes(value);

const operators = {
	includes,
	is,
	isNot: compose(is, not),
	lt,
	gte: compose(lt, not),
	gt,
	lte: compose(gt, not),
	equals,
	notEquals: compose(equals, not)
};

const every = fns => (...args) => fns.every(fn => fn(...args));

function predicate({value = '', operator = 'includes', type = 'string'}) {
	const typeIt = typeExpression(type);
	const operateOnTyped = compose(typeIt, operators[operator]);
	const predicateFunc = operateOnTyped(value);
	return compose(typeIt, predicateFunc);
}

// Avoid useless filter lookup (improve perf)
function normalizeClauses(conf) {
	const output = {};
	const validPath = Object.keys(conf).filter(path => Array.isArray(conf[path]));
	validPath.forEach(path => {
		const validClauses = conf[path].filter(c => c.value !== '');
		if (validClauses.length > 0) {
			output[path] = validClauses;
		}
	});
	return output;
}

function filter(filter) {
	const normalizedClauses = normalizeClauses(filter);
	const funcList = Object.keys(normalizedClauses).map(path => {
		const getter = pointer(path).get;
		const clauses = normalizedClauses[path].map(predicate);
		return compose(getter, every(clauses));
	});
	const filterPredicate = every(funcList);

	return array => array.filter(filterPredicate);
}

function search (searchConf = {}) {
	const {value, scope = []} = searchConf;
	const searchPointers = scope.map(field => pointer(field).get);
	if (scope.length === 0 || !value) {
		return array => array;
	}
	return array => array.filter(item => searchPointers.some(p => String(p(item)).includes(String(value))));
}

function emitter() {
	const listenersLists = {};
	const instance = {
		on(event, ...listeners) {
			listenersLists[event] = (listenersLists[event] || []).concat(listeners);
			return instance;
		},
		dispatch(event, ...args) {
			const listeners = listenersLists[event] || [];
			for (const listener of listeners) {
				listener(...args);
			}
			return instance;
		},
		off(event, ...listeners) {
			if (event === undefined) {
				Object.keys(listenersLists).forEach(ev => instance.off(ev));
			} else {
				const list = listenersLists[event] || [];
				listenersLists[event] = listeners.length ? list.filter(listener => !listeners.includes(listener)) : [];
			}
			return instance;
		}
	};
	return instance;
}

var sliceFactory = ({page = 1, size} = {}) => (array = []) => {
	const actualSize = size || array.length;
	const offset = (page - 1) * actualSize;
	return array.slice(offset, offset + actualSize);
}

const TOGGLE_SORT = 'TOGGLE_SORT';
const DISPLAY_CHANGED = 'DISPLAY_CHANGED';
const PAGE_CHANGED = 'CHANGE_PAGE';
const EXEC_CHANGED = 'EXEC_CHANGED';
const FILTER_CHANGED = 'FILTER_CHANGED';
const SUMMARY_CHANGED = 'SUMMARY_CHANGED';
const SEARCH_CHANGED = 'SEARCH_CHANGED';
const EXEC_ERROR = 'EXEC_ERROR';

function curriedPointer(path) {
	const {get, set} = pointer(path);
	return {get, set: curry(set)};
}

function table ({sortFactory, tableState, data, filterFactory, searchFactory}) {
	const table = emitter();
	const sortPointer = curriedPointer('sort');
	const slicePointer = curriedPointer('slice');
	const filterPointer = curriedPointer('filter');
	const searchPointer = curriedPointer('search');

	const safeAssign = curry((base, extension) => Object.assign({}, base, extension));
	const dispatch = curry(table.dispatch, 2);

	const dispatchSummary = filtered => dispatch(SUMMARY_CHANGED, {
		page: tableState.slice.page,
		size: tableState.slice.size,
		filteredCount: filtered.length
	});

	const exec = ({processingDelay = 20} = {}) => {
		table.dispatch(EXEC_CHANGED, {working: true});
		setTimeout(() => {
			try {
				const filterFunc = filterFactory(filterPointer.get(tableState));
				const searchFunc = searchFactory(searchPointer.get(tableState));
				const sortFunc = sortFactory(sortPointer.get(tableState));
				const sliceFunc = sliceFactory(slicePointer.get(tableState));
				const execFunc = compose(filterFunc, searchFunc, tap(dispatchSummary), sortFunc, sliceFunc);
				const displayed = execFunc(data);
				table.dispatch(DISPLAY_CHANGED, displayed.map(d => {
					return {index: data.indexOf(d), value: d};
				}));
			} catch (err) {
				table.dispatch(EXEC_ERROR, err);
			} finally {
				table.dispatch(EXEC_CHANGED, {working: false});
			}
		}, processingDelay);
	};

	const updateTableState = curry((pter, ev, newPartialState) => compose(
		safeAssign(pter.get(tableState)),
		tap(dispatch(ev)),
		pter.set(tableState)
	)(newPartialState));

	const resetToFirstPage = () => updateTableState(slicePointer, PAGE_CHANGED, {page: 1});

	const tableOperation = (pter, ev) => compose(
		updateTableState(pter, ev),
		resetToFirstPage,
		() => table.exec() // We wrap within a function so table.exec can be overwritten (when using with a server for example)
	);

	const api = {
		sort: tableOperation(sortPointer, TOGGLE_SORT),
		filter: tableOperation(filterPointer, FILTER_CHANGED),
		search: tableOperation(searchPointer, SEARCH_CHANGED),
		slice: compose(updateTableState(slicePointer, PAGE_CHANGED), () => table.exec()),
		exec,
		eval(state = tableState) {
			return Promise
				.resolve()
				.then(() => {
					const sortFunc = sortFactory(sortPointer.get(state));
					const searchFunc = searchFactory(searchPointer.get(state));
					const filterFunc = filterFactory(filterPointer.get(state));
					const sliceFunc = sliceFactory(slicePointer.get(state));
					const execFunc = compose(filterFunc, searchFunc, sortFunc, sliceFunc);
					return execFunc(data).map(d => ({index: data.indexOf(d), value: d}));
				});
		},
		onDisplayChange(fn) {
			table.on(DISPLAY_CHANGED, fn);
		},
		getTableState() {
			const sort = Object.assign({}, tableState.sort);
			const search = Object.assign({}, tableState.search);
			const slice = Object.assign({}, tableState.slice);
			const filter = {};
			for (const prop of Object.getOwnPropertyNames(tableState.filter)) {
				filter[prop] = tableState.filter[prop].map(v => Object.assign({}, v));
			}
			return {sort, search, slice, filter};
		}
	};

	const instance = Object.assign(table, api);

	Object.defineProperty(instance, 'length', {
		get() {
			return data.length;
		}
	});

	return instance;
}

function tableDirective ({
													 sortFactory: sortFactory$$1 = sortFactory,
													 filterFactory = filter,
													 searchFactory = search,
													 tableState = {sort: {}, slice: {page: 1}, filter: {}, search: {}},
													 data = []
												 }, ...tableDirectives) {

	const coreTable = table({sortFactory: sortFactory$$1, filterFactory, tableState, data, searchFactory});

	return tableDirectives.reduce((accumulator, newdir) => Object.assign(accumulator, newdir({
			sortFactory: sortFactory$$1,
			filterFactory,
			searchFactory,
			tableState,
			data,
			table: coreTable
		}))
		, coreTable);
}

const table$1 = tableDirective;

const get = curry((array, index) => array[index]);
const replace = curry((array, newVal, index) => array.map((val, i) => (index === i ) ? newVal : val));
const patch = curry((array, newVal, index) => replace(array, Object.assign(array[index], newVal), index));
const remove = curry((array, index) => array.filter((val, i) => index !== i));
const insert = curry((array, newVal, index) => [...array.slice(0, index), newVal, ...array.slice(index)]);

function crud ({data, table}) {
  // empty and refill data keeping the same reference
  const mutateData = (newData) => {
    data.splice(0);
    data.push(...newData);
  };
  const refresh = compose(mutateData, table.exec);
  return {
    update(index,newVal){
      return compose(replace(data,newVal),refresh)(index);
    },
    patch(index, newVal){
      return patch(data, newVal, index);
    },
    remove: compose(remove(data), refresh),
    insert(newVal, index = 0){
      return compose(insert(data, newVal), refresh)(index);
    },
    get: get(data)
  };
}

// it is like Redux but using smart table which already behaves more or less like a store and like a reducer in the same time.
// of course this impl is basic: error handling etc are missing and reducer is "hardcoded"
const reducerFactory = function (smartTable) {
  return function (state = {
    tableState: smartTable.getTableState(),
    displayed: [],
    summary: {},
    isProcessing: false
  }, action) {
    const {type, args} = action;
    switch (type) {
      case 'TOGGLE_FILTER': {
        const {filter} = action;
        return Object.assign({}, state, {activeFilter: filter});
      }
      default: //proxy to smart table
        if (smartTable[type]) {
          smartTable[type](...args);
        }
        return state;
    }
  }
};

function createStore (smartTable) {

  const reducer = reducerFactory(smartTable);

  let currentState = {
    tableState: smartTable.getTableState()
  };
  let summary;
  let listeners = [];

  const broadcast = () => {
    for (let l of listeners) {
      l();
    }
  };

  smartTable.on('SUMMARY_CHANGED', function (s) {
    summary = s;
  });

  smartTable.on('EXEC_CHANGED', function ({working}) {
    Object.assign(currentState, {
      isProcessing: working
    });
    broadcast();
  });

  smartTable.onDisplayChange(function (displayed) {
    Object.assign(currentState, {
      tableState: smartTable.getTableState(),
      displayed,
      summary
    });
    broadcast();
  });

  return {
    subscribe(listener){
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      }
    },
    getState(){
      return Object.assign({}, currentState, {tableState:smartTable.getTableState()});
    },
    dispatch(action = {}){
      currentState = reducer(currentState, action);
      if (action.type && !smartTable[action.type]) {
        broadcast();
      }
    }
  };
}

//data coming from global
const tableState = {search: {}, filter: {}, sort: {}, slice: {page: 1, size: 20}};
//the smart table
const table$2 = table$1({data, tableState}, crud);
//the store
var store = createStore(table$2);

function debounce (fn, delay = 300) {
  let timeoutId;
  return (ev) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(function () {
      fn(ev);
    }, delay);
  };
}
const trapKeydown = (...keys) => (ev) => {
  const {keyCode} =ev;
  if (keys.indexOf(keyCode) === -1) {
    ev.stopPropagation();
  }
};

const autoFocus = onMount(n => n.dom.focus());
const Input = autoFocus(props => {
  delete  props.children; //no children for inputs
  return h( 'input', props)
});

const toggleOnKeyDown = props => (ev) => {
  const {keyCode} = ev;
  if (keyCode === 13) {
    props.toggleEdit(true)();
  } else if (keyCode === 27) {
    ev.currentTarget.focus();
  }
};

const InputCell = (props) => {

  const onKeydown = toggleOnKeyDown(props);

  return h( 'td', { tabIndex: "-1", onKeyDown: onKeydown, onClick: props.toggleEdit(true), class: props.className },
    props.isEditing === 'true' ?
        h( Input, { onKeydown: trapKeydown(27), type: props.type || 'text', value: props.currentValue, onInput: props.onInput, onBlur: props.toggleEdit(false) })
        : h( 'span', null, props.currentValue )
  );
};

const makeEditable = comp => {
  return withState((props, setState) => {
    const toggleEdit = (val) => () => setState(Object.assign({}, props, {isEditing: val !== void 0 ? val : props.isEditing !== true}));
    const fullProps = Object.assign({}, {toggleEdit}, props);
    return comp(fullProps);
  });
};

const EditableLastName = makeEditable((props) => {
  const {toggleEdit, person, index, className, patch, isEditing} = props;
  let currentValue = person.name.last;
  const onInput = debounce(ev => {
    currentValue = ev.target.value;
    patch(index, {name: {last: currentValue, first: person.name.first}});
  });

  return h( InputCell, { isEditing: String(isEditing === true), toggleEdit: toggleEdit, className: className, currentValue: currentValue, onInput: onInput });
});

const EditableFirstName = makeEditable((props) => {
  const {toggleEdit, person, index, className, patch, isEditing} = props;
  let currentValue = person.name.first;
  const onInput = debounce(ev => {
    currentValue = ev.target.value;
    patch(index, {name: {first: currentValue, last: person.name.last}});
  });

  return h( InputCell, { isEditing: String(isEditing === true), toggleEdit: toggleEdit, className: className, currentValue: currentValue, onInput: onInput })
});

const GenderSelect = autoFocus(({onChange, toggleEdit, person}) => {
  return h( 'select', { onKeyDown: trapKeydown(27), name: "gender select", onChange: onChange, onBlur: toggleEdit(false) },
    h( 'option', { value: "male", selected: person.gender === 'male' }, "male"),
    h( 'option', { value: "female", selected: person.gender === 'female' }, "female")
  )
});

const EditableGender = makeEditable((props) => {
  const {toggleEdit, person, index, className, patch, isEditing} = props;
  let currentValue = person.gender;

  const onKeydown = toggleOnKeyDown(props);

  const onChange = debounce(ev => {
    currentValue = ev.target.value;
    patch(index, {gender: currentValue});
  });
  const genderClass = person.gender === 'female' ? 'gender-female' : 'gender-male';

  return h( 'td', { tabIndex: "-1", onKeyDown: onKeydown, onClick: toggleEdit(true), class: className },
    isEditing ? h( GenderSelect, { onChange: onChange, toggleEdit: toggleEdit, person: person }) :
        h( 'span', { class: genderClass }, currentValue)
  );
});

const EditableSize = makeEditable((props) => {
  const {toggleEdit, person, index, className, patch, isEditing} = props;
  let currentValue = person.size;
  const onInput = debounce(ev => {
    currentValue = ev.target.value;
    patch(index, {size: currentValue});
  });
  const ratio = Math.min((person.size - 150) / 50, 1) * 100;

  const onKeydown = toggleOnKeyDown(props);

  return h( 'td', { tabIndex: "-1", class: className, onKeyDown: onKeydown, onClick: toggleEdit(true) },
    isEditing ? h( Input, { onKeydown: trapKeydown(27), type: "number", min: "150", max: "200", value: currentValue, onBlur: toggleEdit(false), onInput: onInput }) :
        h( 'span', null, h( 'span', { style: `height: ${ratio}%`, class: "size-stick" }), currentValue )
  );
});

const EditableBirthDate = makeEditable((props) => {
  const {toggleEdit, person, index, className, patch, isEditing} = props;
  let currentValue = person.birthDate;

  const onInput = debounce(ev => {
    currentValue = ev.target.value;
    patch(index, {birthDate: new Date(currentValue)});
  });

  return h( InputCell, { type: "date", isEditing: String(isEditing === true), toggleEdit: toggleEdit, className: className, currentValue: currentValue.toDateString(), onInput: onInput })
});

const IconFilter = () => (h( 'svg', { 'aria-hidden': "true", class: "icon", viewBox: "0 0 32 32" },
  h( 'path', {
    d: "M16 0c-8.837 0-16 2.239-16 5v3l12 12v10c0 1.105 1.791 2 4 2s4-0.895 4-2v-10l12-12v-3c0-2.761-7.163-5-16-5zM2.95 4.338c0.748-0.427 1.799-0.832 3.040-1.171 2.748-0.752 6.303-1.167 10.011-1.167s7.262 0.414 10.011 1.167c1.241 0.34 2.292 0.745 3.040 1.171 0.494 0.281 0.76 0.519 0.884 0.662-0.124 0.142-0.391 0.38-0.884 0.662-0.748 0.427-1.8 0.832-3.040 1.171-2.748 0.752-6.303 1.167-10.011 1.167s-7.262-0.414-10.011-1.167c-1.24-0.34-2.292-0.745-3.040-1.171-0.494-0.282-0.76-0.519-0.884-0.662 0.124-0.142 0.391-0.38 0.884-0.662z" })
));

const IconBin = () => (h( 'svg', { 'aria-hidden': "true", class: "icon", viewBox: "0 0 32 32" },
  h( 'path', { d: "M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z" })
));

const IconSort = () => (h( 'svg', { class: "icon", viewBox: "0 0 32 32" },
  h( 'path', { d: "M2 6h28v6h-28zM2 14h28v6h-28zM2 22h28v6h-28z" })
));

const IconSortAsc = () => (h( 'svg', { class: "icon", viewBox: "0 0 32 32" },
  h( 'path', { d: "M10 24v-24h-4v24h-5l7 7 7-7h-5z" }),
  h( 'path', { d: "M14 18h18v4h-18v-4z" }),
  h( 'path', { d: "M14 12h14v4h-14v-4z" }),
  h( 'path', { d: "M14 6h10v4h-10v-4z" }),
  h( 'path', { d: "M14 0h6v4h-6v-4z" })
));

const IconSortDesc = () => (h( 'svg', { class: "icon", viewBox: "0 0 32 32" },
  h( 'path', { d: "M10 24v-24h-4v24h-5l7 7 7-7h-5z" }),
  h( 'path', { d: "M14 0h18v4h-18v-4z" }),
  h( 'path', { d: "M14 6h14v4h-14v-4z" }),
  h( 'path', { d: "M14 12h10v4h-10v-4z" }),
  h( 'path', { d: "M14 18h6v4h-6v-4z" })
));

const mapStateToProp = state => ({persons: state});
const doesUpdateList = (previous, current) => {
  let output = true;
  if (typeof previous === typeof current) {
    output = previous.length !== current.length || previous.some((i, k) => previous[k].value.id !== current[k].value.id);
  }
  return output;
};
const sliceState = state => state.displayed;
const actions = {
  remove: index => store.dispatch({type: 'remove', args: [index]}),
  patch: (index, value) => store.dispatch({type: 'patch', args: [index, value]})
};
const subscribeToDisplay = connect(store, actions, sliceState);
const focusFirstCell = onUpdate(vnode => {
  const firstCell = vnode.dom.querySelector('td');
  if (firstCell !== null) {
    firstCell.focus();
  }
});

const TBody = focusFirstCell(({persons = [], patch, remove}) => {
  return persons.length ? h( 'tbody', null,
    persons.map(({value, index}) => h( 'tr', null,
        h( EditableLastName, { className: "col-lastname", person: value, index: index, patch: patch }),
        h( EditableFirstName, { className: "col-firstname", person: value, index: index, patch: patch }),
        h( EditableBirthDate, { className: "col-birthdate", person: value, index: index, patch: patch }),
        h( EditableGender, { className: "col-gender fixed-size", person: value, index: index, patch: patch }),
        h( EditableSize, { className: "col-size fixed-size", person: value, index: index, patch: patch }),
        h( 'td', { class: "fixed-size col-actions", 'data-keyboard-selector': "button" },
          h( 'button', { tabindex: "-1", onClick: () => remove(index) },
            h( 'span', { class: "visually-hidden" }, 'Delete ' + value.name.last + ' ' + value.name.first),
            h( IconBin, null )
          )
        )
      ))
    ) : h( 'tbody', null,
    h( 'tr', null,
      h( 'td', { tabIndex: "-1", colSpan: "6" }, "There is no data matching your request")
    )
    )
});

const PersonListComponent = (props, actions) => {
  return h( TBody, { persons: props.persons, remove: actions.remove, patch: actions.patch })
};

const PersonList = subscribeToDisplay(PersonListComponent, mapStateToProp, doesUpdateList);

const actions$1 = {};
const sliceState$1 = state => ({isProcessing: state.isProcessing});
const subscribeToProcessing = connect(store, actions$1, sliceState$1);

const LoadingIndicator = ({isProcessing}) => {
  const className = isProcessing === true ? 'st-working' : '';
  const message = isProcessing === true ? 'loading persons data' : 'data loaded';
  return h( 'div', { id: "overlay", 'aria-live': "assertive", role: "alert", class: className },
    message
  );
};
const WorkInProgress = subscribeToProcessing(LoadingIndicator);

const actions$2 = {
  toggleSort: ({pointer: pointer$$1, direction}) => store.dispatch({type: 'sort', args: [{pointer: pointer$$1, direction}]})
};
const sortState = pointer('tableState.sort').get;
const subscribeToSort = connect(store, actions$2, sortState);


const Icon = ({direction}) => {
  if (direction === 'asc') {
    return h( IconSortAsc, null );
  } else if (direction === 'desc') {
    return h( IconSortDesc, null );
  } else {
    return h( IconSort, null );
  }
};

const SortButtonComponent = (props => {
  const {columnPointer, sortDirections = ['asc', 'desc'], pointer: pointer$$1, direction, sort} = props;
  const actualCursor = columnPointer !== pointer$$1 ? -1 : sortDirections.indexOf(direction);
  const newCursor = (actualCursor + 1 ) % sortDirections.length;

  const toggleSort = () => sort({pointer: columnPointer, direction: sortDirections[newCursor]});

  return h( 'button', { tabindex: "-1", onClick: toggleSort },
    h( 'span', { class: "visually-hidden" }, "Toggle sort"),
    h( Icon, { direction: sortDirections[actualCursor] })
  )
});

const SortButton = subscribeToSort((props, actions) =>
  h( SortButtonComponent, Object.assign({}, props, { sort: actions.toggleSort })));

const actions$3 = {
  search: (value, scope) => store.dispatch({type: 'search', args: [{value, scope}]})
};
const sliceState$2 = pointer('tableState.search').get;
const noNeedForUpdate = state => false;// always return the same value
const searchable = connect(store, actions$3, sliceState$2);

const SearchInput = (props) => (h( 'label', null,
  h( 'span', null, props.children ),
  h( 'input', { tabindex: "0", type: "search", onInput: props.onInput, placeholder: props.placeholder })
));

const SearchRow = searchable((props, actions) => {
  const onInput = debounce(ev => actions.search(ev.target.value, ['name.last', 'name.first']), 300);
  delete props.children;
  return h( 'tr', props,
    h( 'th', { 'data-keyboard-selector': "input" },
      h( SearchInput, { placeholder: "Case sensitive search on surname and name", onInput: onInput }, "Search:")
    )
  )
}, noNeedForUpdate, noNeedForUpdate);

const focusOnOpen = onUpdate(vnode => {
  const ah = vnode.props['aria-hidden'];
  if (ah === 'false') {
    const input = vnode.dom.querySelector('input, select');
    if (input) {
      setTimeout(() => input.focus(), 5);
    }
  }
});

const actions$4 = {
  toggleFilterMenu: (filter) => store.dispatch({type: 'TOGGLE_FILTER', filter}),
  commitFilter: (value) => store.dispatch({type: 'filter', args: [value]})
};
const sliceState$3 = state => ({activeFilter: state.activeFilter, filterClauses: state.tableState.filter});
const subscribeToFilter = connect(store, actions$4, sliceState$3);

const FilterRowComp = focusOnOpen((props = {}) => {
  const {isHidden, toggleFilterMenu, commitFilter} = props;
  const close = () => {
    toggleFilterMenu(null);
    document.querySelector(`[aria-controls=${idName}]`).focus();
  };
  const onSubmit = (ev) => {
    const form = ev.target;
    const {name} = form;
    const inputs = form.querySelectorAll('input, select');
    commitFilter({
      [name]: [...inputs].map(input => {
        return {type: input.type, value: input.value, operator: input.getAttribute('data-operator') || 'includes'}
      })
    });
    ev.preventDefault();
    close();
  };
  const idName = ['filter'].concat(props.scope.split('.')).join('-');
  const onKeyDown = (ev) => {
    if (ev.code === 'Escape' || ev.keyCode === 27 || ev.key === 'Escape') {
      close();
    }
  };

  const ariaHidden = isHidden !== true;
  return h( 'tr', { id: idName, class: "filter-row", onKeydown: onKeyDown, 'data-keyboard-skip': ariaHidden, 'aria-hidden': String(ariaHidden) },
    h( 'th', { colspan: "6", 'data-keyboard-selector': "input, select" },
      h( 'form', { name: props.scope, onSubmit: onSubmit },
        props.children,
        h( 'div', { class: "visually-hidden" },
          h( 'button', { tabIndex: "-1" }, "Apply")
        ),
        h( 'p', { id: idName + '-instruction' }, "Press Enter to activate filter or escape to dismiss")
      )
    )
  )
});

const FilterButton = (props) => {
  const {columnPointer, toggleFilterMenu, filterClauses = {}}=props;
  const currentFilterClauses = filterClauses[columnPointer] || [];
  const controlled = ['filter'].concat(columnPointer.split('.')).join('-');
  const onClick = () => toggleFilterMenu(columnPointer);
  const isActive = currentFilterClauses.length && currentFilterClauses.some(clause => clause.value);
  return h( 'button', { 'aria-haspopup': "true", tabindex: "-1", class: isActive ? 'active-filter' : '', 'aria-controls': controlled, onClick: onClick },
    h( 'span', { class: "visually-hidden" }, "Toggle Filter menu"),
    h( IconFilter, null )
  )
};

const ToggleFilterButton = subscribeToFilter((props, actions) => {
  return h( FilterButton, Object.assign({}, props, { toggleFilterMenu: actions.toggleFilterMenu }));
});

const FilterRow = subscribeToFilter((props, actions) => {
  return h( FilterRowComp, { scope: props.scope, isHidden: props.activeFilter === props.scope, toggleFilterMenu: actions.toggleFilterMenu, commitFilter: actions.commitFilter },

    props.children
  );
});

const ColumnHeader = (props) => {
  const {columnPointer, sortDirections = ['asc', 'desc'], className, children} = props;

  return h( 'th', { class: className, 'data-keyboard-selector': "button" },
    children,
    h( 'div', { class: "buttons-container" },
      h( SortButton, { columnPointer: columnPointer, sortDirections: sortDirections }),
      h( ToggleFilterButton, { columnPointer: columnPointer })
    )
  )
};

const Headers = () => {

  return h( 'thead', null,
  h( SearchRow, { class: "filter-row" }),
  h( 'tr', null,
    h( ColumnHeader, { className: "col-lastname", columnPointer: "name.last", sortDirections: ['asc', 'desc', 'none'] }, "Surname"),
    h( ColumnHeader, { className: "col-firstname", columnPointer: "name.first" }, "Name"),
    h( ColumnHeader, { className: "col-birthdate", sortDirections: ['desc', 'asc'], columnPointer: "birthDate" }, "Date of birth"),
    h( ColumnHeader, { className: "col-gender fixed-size", columnPointer: "gender" }, "Gender"),
    h( ColumnHeader, { className: "col-size fixed-size", columnPointer: "size" }, "Size"),
    h( 'th', { 'data-keyboard-skip': true, class: "fixed-size col-actions" })
  ),
  h( FilterRow, { scope: "name.last" },
    h( 'label', null,
      h( 'span', null, "surname includes:" ),
      h( 'input', { 'aria-describedby': "filter-name-last-instruction", onKeyDown: trapKeydown(27, 38, 40), type: "text", placeholder: "case insensitive surname value" })
    )
  ),
  h( FilterRow, { scope: "name.first" },
    h( 'label', null,
      h( 'span', null, "name includes:" ),
      h( 'input', { onKeyDown: trapKeydown(27, 38, 40), type: "text", placeholder: "case insensitive name value" })
    )
  ),
  h( FilterRow, { scope: "birthDate" },
    h( 'label', null,
      h( 'span', null, "born after:" ),
      h( 'input', { onKeyDown: trapKeydown(27), 'data-operator': "gt", type: "date" })
    )
  ),
  h( FilterRow, { scope: "gender" },
    h( 'label', null,
      h( 'span', null, "gender is:" ),
      h( 'select', { onKeyDown: trapKeydown(27), 'data-operator': "is" },
        h( 'option', { value: "" }, "-"),
        h( 'option', { value: "female" }, "female"),
        h( 'option', { value: "male" }, "male")
      )
    )
  ),
  h( FilterRow, { scope: "size" },
    h( 'label', null,
      h( 'span', null, "taller than:" ),
      h( 'input', { onKeyDown: trapKeydown(27), min: "150", max: "200", step: "1", type: "range", 'data-operator': "gt" })
    ),
    h( 'label', null,
      h( 'span', null, "smaller than:" ),
      h( 'input', { onKeyDown: trapKeydown(27), min: "150", max: "200", step: "1", type: "range", 'data-operator': "lt" })
    )
  )
  )
};

const actions$5 = {
  slice: (page, size) => store.dispatch({type: 'slice', args: [{page, size}]})
};
const sliceState$4 = state => state.summary;
const subscribeToSummary = connect(store, actions$5, sliceState$4);

const Summary = (props) => {
  const {page, size, filteredCount} = props;
  return (h( 'div', null, " showing items ", h( 'strong', null, (page - 1) * size + (filteredCount > 0 ? 1 : 0) ), " - ", h( 'strong', null, Math.min(filteredCount, page * size) ), " of ", h( 'strong', null, filteredCount ), " matching items" ));
};

const PageSize = props => {
  const {size, slice} = props;
  const changePageSize = (ev) => slice(1, Number(ev.target.value));
  return h( 'div', null,
    h( 'label', null, "Page size ", h( 'select', { tabIndex: "-1", onChange: changePageSize, name: "pageSize" },
        h( 'option', { selected: size == 20, value: "20" }, "20 items"),
        h( 'option', { selected: size == 30, value: "30" }, "30 items"),
        h( 'option', { selected: size == 50, value: "50" }, "50 items")
      )
    )
  )
};

const Pager = (props) => {
  const {page, size, filteredCount, slice} = props;
  const selectPreviousPage = () => slice(page - 1, size);
  const selectNextPage = () => slice(page + 1, size);
  const isPreviousDisabled = page === 1;
  const isNextDisabled = (filteredCount - (page * size)) <= 0;

  return (
    h( 'div', null,
      h( 'button', { tabIndex: "-1", onClick: selectPreviousPage, disabled: isPreviousDisabled }, "Previous"),
      h( 'small', null, " Page - ", page || 1, " " ),
      h( 'button', { tabIndex: "-1", onClick: selectNextPage, disabled: isNextDisabled }, "Next")
    )
  );
};

const SummaryFooter = subscribeToSummary(Summary);
const Pagination = subscribeToSummary((props, actions) => h( Pager, Object.assign({}, props, { slice: actions.slice })));
const SelectPageSize = subscribeToSummary((props, actions) => h( PageSize, Object.assign({}, props, { slice: actions.slice })));

const Footer = () => h( 'tfoot', null,
h( 'tr', null,
  h( 'td', { colspan: "3" },
    h( SummaryFooter, null )
  ),
  h( 'td', { colspan: "2", 'data-keyboard-selector': "button:not(:disabled)", colSpan: "3" },
    h( Pagination, null )
  ),
  h( 'td', { 'data-keyboard-selector': "select" },
    h( SelectPageSize, null )
  )
)
);

const findContainer = (element, selector) => element.matches(selector) === true ? element : findContainer(element.parentElement, selector);
const dataSelectorAttribute = 'data-keyboard-selector';
const dataSkipAttribute = 'data-keyboard-skip';
const valFunc = val => () => val;

function regularCell (element, {rowSelector, cellSelector}) {
  const row = findContainer(element, rowSelector);
  const cells = [...row.querySelectorAll(cellSelector)];
  const index = cells.indexOf(element);
  const returnEl = valFunc(element);
  return {
    selectFromAfter: returnEl,
    selectFromBefore: returnEl,
    next(){
      return cells[index + 1] !== void 0 ? cells[index + 1] : null;
    },
    previous(){
      return cells[index - 1] !== void 0 ? cells[index - 1] : null;
    }
  }
}

function skipCell (element, options) {
  const reg = regularCell(element, options);
  return {
    previous: reg.previous,
    next: reg.next
  }
}

function compositeCell (element, options) {
  const cellElement = findContainer(element, options.cellSelector);
  const selector = cellElement.getAttribute(dataSelectorAttribute);
  const subWidgets = [...cellElement.querySelectorAll(selector)];
  const widgetsLength = subWidgets.length;
  const isSubWidget = element !== cellElement;
  return {
    selectFromBefore(){
      return isSubWidget ? element : subWidgets[0];
    },
    selectFromAfter(){
      return isSubWidget ? element : subWidgets[widgetsLength - 1];
    },
    next(){
      const index = subWidgets.indexOf(element);
      if (isSubWidget && index + 1 < widgetsLength) {
        return subWidgets[index + 1];
      } else {
        return regularCell(cellElement, options).next();
      }
    },
    previous(){
      const index = subWidgets.indexOf(element);
      if (isSubWidget && index > 0) {
        return subWidgets[index - 1];
      } else {
        return regularCell(cellElement, options).previous();
      }
    }
  }
}

function createCell (el, options) {
  if (el === null) {
    return null;
  } else if (el.hasAttribute(dataSkipAttribute)) {
    return skipCell(el, options);
  } else if (el.hasAttribute(dataSelectorAttribute) || !el.matches(options.cellSelector)) {
    return compositeCell(el, options);
  } else {
    return regularCell(el, options);
  }
}

function regularRow (element, grid, {rowSelector = 'tr', cellSelector = 'th,td'}={}) {
  const rows = [...grid.querySelectorAll(rowSelector)];
  const cells = [...element.querySelectorAll(cellSelector)];
  const index = rows.indexOf(element);
  return {
    previous(){
      return rows[index - 1] !== void 0 ? rows[index - 1] : null;
    },
    next(){
      return rows[index + 1] !== void 0 ? rows[index + 1] : null;
    },
    item(index){
      return cells[index] !== void 0 ? cells[index] : null;
    }
  };
}

function skipRow (element, grid, options) {
  const regular = regularRow(element, grid, options);
  return {
    previous: regular.previous,
    next: regular.next
  };
}

function createRow (target, grid, {rowSelector, cellSelector}={}) {
  if (target === null) {
    return null;
  }
  const r = findContainer(target, rowSelector);
  return r.hasAttribute(dataSkipAttribute) ? skipRow(r, grid, {
      rowSelector,
      cellSelector
    }) : regularRow(target, grid, {rowSelector, cellSelector});
}

function keyGrid (grid, options) {
  const {rowSelector, cellSelector} = options;
  return {
    moveRight(target){
      const cell = createCell(target, options);
      let newCell = createCell(cell.next(), options);
      while (newCell !== null && newCell.selectFromBefore === void 0) {
        newCell = createCell(newCell.next(), options);
      }
      return newCell !== null ? newCell.selectFromBefore() : target;
    },
    moveLeft(target){
      const cell = createCell(target, options);
      let newCell = createCell(cell.previous(), options);
      while (newCell !== null && newCell.selectFromAfter === void 0) {
        newCell = createCell(newCell.previous(), options);
      }
      return newCell !== null ? newCell.selectFromAfter() : target;
    },
    moveUp(target){
      const rowElement = findContainer(target, rowSelector);
      const cells = [...rowElement.querySelectorAll(cellSelector)];
      const row = createRow(rowElement, grid, options);
      let newRow = createRow(row.previous(), grid, options);
      while (newRow !== null && newRow.item === void 0) {
        newRow = createRow(newRow.previous(), grid, options);
      }

      if (newRow === null) {
        return target;
      }

      let askedIndex = cells.indexOf(findContainer(target, cellSelector));
      let newCell = createCell(newRow.item(askedIndex), options);
      while (newCell === null || newCell.selectFromBefore === void 0 && askedIndex > 0) {
        askedIndex--;
        newCell = createCell(newRow.item(askedIndex), options);
      }
      return newCell.selectFromBefore();
    },
    moveDown(target){
      const rowElement = findContainer(target, rowSelector);
      const cells = [...rowElement.querySelectorAll(cellSelector)];
      const row = createRow(rowElement, grid, options);
      let newRow = createRow(row.next(), grid, options);
      while (newRow !== null && newRow.item === void 0) {
        newRow = createRow(newRow.next(), grid, options);
      }

      if (newRow === null) {
        return target;
      }

      let askedIndex = cells.indexOf(findContainer(target, cellSelector));
      let newCell = createCell(newRow.item(askedIndex), options);
      while (newCell === null || newCell.selectFromBefore === void 0 && askedIndex > 0) {
        askedIndex--;
        newCell = createCell(newRow.item(askedIndex), options);
      }
      return newCell.selectFromBefore();
    }
  }
}

function keyboard (grid, {rowSelector = 'tr', cellSelector = 'td,th'}={}) {
  let lastFocus = null;
  const kg = keyGrid(grid, {rowSelector, cellSelector});

  grid.addEventListener('keydown', ({target, keyCode}) => {
    let newCell = null;
    if (keyCode === 37) {
      newCell = kg.moveLeft(target);
    } else if (keyCode === 38) {
      newCell = kg.moveUp(target);
    } else if (keyCode === 39) {
      newCell = kg.moveRight(target);
    } else if (keyCode === 40) {
      newCell = kg.moveDown(target);
    }

    if (newCell !== null) {
      newCell.focus();
      if (lastFocus !== null) {
        lastFocus.setAttribute('tabindex', '-1');
      }
      newCell.setAttribute('tabindex', '0');
      lastFocus = newCell;
    }
  });
}

const table$3 = onMount(n => {
  store.dispatch({type: 'exec', args: []}); //kick smartTable
  keyboard(n.dom.querySelector('table'));
});

const PersonTable = table$3(() =>
  h( 'div', { id: "table-container" },
    h( WorkInProgress, null ),
    h( 'table', null,
      h( Headers, null ),
      h( PersonList, null ),
      h( Footer, null )
    )
  ));

setTimeout(() => mount(PersonTable, {}, document.getElementById('demo-container')), 10);

}());
