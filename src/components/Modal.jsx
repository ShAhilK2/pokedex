import { Children } from "react";
import ReactDOM from "react-dom";
export default function Modal({ children, handleCloseModal }) {
  return ReactDOM.createPortal(
    <div className="modal-container">
      <button onClick={handleCloseModal} className="modal-underlay" />
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById("portal")
  );
}
