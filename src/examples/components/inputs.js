import {h, onMount} from 'flaco';

export const autoFocus = onMount(n => n.dom.focus());
export const Input = autoFocus(props => {
  delete  props.children; //no children for inputs
  return <input {...props} />
});