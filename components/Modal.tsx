import { Button } from '.';

interface ModalProps {
  onSubmit?: () => void;
  onClose?: () => void;
  handleClose?: () => void;
  className?: string;
  withoutBackground?: boolean;
  title?: string;
  isClosable?: boolean;
  unCancellable?: boolean;
  children?: JSX.Element | JSX.Element[] | string;
  submitLabel?: string;
  cancelLabel?: string;
  isDisabled?: boolean;
  isShowSubmit?: boolean;
  isShowCancel?: boolean;
}

const modal = (props: ModalProps) => {
  const {
    className,
    children,
    title,
    submitLabel,
    cancelLabel,
    isDisabled,
    onSubmit,
    isClosable,
    handleClose,
    isShowCancel,
    isShowSubmit,
  } = props;
  return (
    <div className="modal__container">
      <div
        className="modal__background"
        onClick={() => handleClose && handleClose()}
      />
      <div className={`${className} modal`}>
        {isClosable && (
          <i className="icon-cross icon__close" onClick={handleClose} />
        )}
        {title && <div className="modal__header">{title}</div>}
        <div className="modal__content">
          {children}
          <div
            className={`btn__container justify-content-center
              `}
          >
            {isShowSubmit && (
              <Button
                type="primary"
                size="normal"
                onClick={onSubmit}
                isDisabled={isDisabled}
                className="text__white"
              >
                {submitLabel || 'Ok'}
              </Button>
            )}
            {isShowCancel && (
              <Button
                size="normal"
                type="transparent"
                onClick={() => handleClose && handleClose()}
                className="text__grey"
              >
                {cancelLabel || 'Cancel'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { modal as Modal };
