import Modal from 'vueleton/lib/modal/bundle';
import { i18n } from '@/common/util';
import Message from './message';

export function showMessage(message) {
  const modal = Modal.show(h => h(Message, {
    props: { message },
    on: {
      dismiss() {
        modal.close();
        message.onDismiss?.();
      },
    },
  }), {
    transition: 'in-out',
  });
  if (message.buttons) {
    // TODO: implement proper keyboard navigation, autofocus, and Enter/Esc in Modal module
    document.querySelector('.vl-modal button').focus();
  } else {
    const timer = setInterval(() => {
      if (!document.querySelector('.vl-modal .modal-content:hover')) {
        clearInterval(timer);
        modal.close();
      }
    }, message.timeout || 2000);
  }
}

/**
 * @param {string} text - the text to display in the modal
 * @param {Object} cfg
 * @param {string | false} [cfg.input=false] if not false, shows a text input with this string
 * @param {?Object|false} [cfg.ok] additional props for the Ok button or `false` to remove it
 * @param {?Object|false} [cfg.cancel] same for the Cancel button
 * @return {Promise<?string>} resolves on Ok to `false` or the entered string, rejects otherwise
 */
export function showConfirmation(text, { ok, cancel, input = false } = {}) {
  return new Promise((resolve, reject) => {
    showMessage({
      input,
      text,
      buttons: [
        ok !== false && { text: i18n('buttonOK'), onClick: resolve, ...ok },
        cancel !== false && { text: i18n('buttonCancel'), onClick: reject, ...cancel },
      ].filter(Boolean),
      onBackdropClick: reject,
      onDismiss: reject, // Esc key
    });
  });
}

/** Focus the first tabindex=-1 element or root, to enable scrolling via Home/End/PgUp/PgDn */
export function focusMe() {
  setTimeout(() => {
    const el = this.$el;
    (el.querySelector('[tabindex="-1"]') || (el.tabIndex = -1, el)).focus();
  });
}
