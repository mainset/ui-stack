import { createOverlayBasicComponent, initOverlayByIdToggler } from '../hocs';

const ModalBasic = createOverlayBasicComponent({
  BASIC_CLASS_NAME: 'ms-modal',
});

ModalBasic.Actions = {
  initModalByIdToggler: initOverlayByIdToggler,
};

export { ModalBasic };
export default ModalBasic;
