import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';

function reposition(el: HTMLElement, maxHeight: number, optionHeight: number) {
  const list = el.lastChild as HTMLElement;
  const isAbove = el.classList.contains('multiselect--above');
  const { top, height, width, left } = el.getBoundingClientRect();

  list.style.width = `${width}px`;
  list.style.position = 'fixed';
  list.style.bottom = 'auto';

  if (isAbove) {
    const innerList = list.children[0] as HTMLElement;
    const dropdownHeight =
      innerList.clientHeight > optionHeight
        ? Math.min(maxHeight, innerList.clientHeight)
        : innerList.clientHeight;
    list.style.top = `${top - dropdownHeight}px`;
    list.style.left = `${left}px`;
  } else {
    list.style.top = `${top + height}px`;
    list.style.left = `${left}px`;
  }
}

let selectIsOpen = false;

export const directiveDropdownOverflow: DirectiveOptions = {
  inserted: (el: HTMLElement, _binding: DirectiveBinding, vNode: VNode) => {
    if (_binding.value) {
      const dropdownNode = vNode as Dropdown.Node;
      const maxHeight = dropdownNode.child.maxHeight;
      const optionHeight = dropdownNode.child.optionHeight;

      dropdownNode.child.$watch(
        'isOpen',
        (isOpen: boolean) => {
          selectIsOpen = isOpen;
          if (isOpen) {
            reposition(el, maxHeight, optionHeight);
          }
        },
        {
          immediate: true,
        },
      );

      dropdownNode.child.$watch(
        'search',
        () => {
          reposition(el, maxHeight, optionHeight);
        },
        {
          immediate: true,
        },
      );

      document.addEventListener(
        'wheel',
        (event) => {
          if (selectIsOpen) {
            // disabled outside scroll when select is open
            event.stopPropagation();
          }
        },
        true,
      );
    }
  },
};
