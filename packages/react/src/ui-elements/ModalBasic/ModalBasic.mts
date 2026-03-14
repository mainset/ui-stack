import {
  createOverlayBasicComponent,
  initOverlayByIdToggler,
} from '../hocs/index.mjs';

const ModalBasic = createOverlayBasicComponent({
  BASIC_CLASS_NAME: 'ms-modal',
});

ModalBasic.Actions = {
  initModalByIdToggler: initOverlayByIdToggler,
};

export { ModalBasic };
