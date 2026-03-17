import { cnx } from '@mainset/ui-core';
import PropTypes from 'prop-types';

import { ModalBasic } from '../../src';

const ModalStyled = ({ id, modalHandlerProps, children, className }) => (
  <ModalBasic
    id={id}
    modalHandlerProps={modalHandlerProps}
    className={cnx('hrf-modal-styled', className)}
  >
    <button
      type="button"
      onClick={ModalBasic.Actions.initModalByIdToggler(id, modalHandlerProps)}
    >
      Close
    </button>
    {children}
  </ModalBasic>
);

ModalStyled.defaultProps = {
  className: '',
  modalHandlerProps: {},
};

ModalStyled.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,

  className: PropTypes.string,
  modalHandlerProps: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};

export default ModalStyled;
