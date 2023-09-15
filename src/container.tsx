import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

import { useAllExtensions } from "./hooks";

export function ExtensionContainer() {
  const { handleMsg } = useAllExtensions();
  const { ext } = useParams();

  useLayoutEffect(() => {
    window.addEventListener("message", handleMsg);
  }, [handleMsg]);

  return (
    <iframe
      src={`https://${ext}.ext.eidos.space`}
      frameBorder="0"
      style={{ width: "100vw", height: "100vh" }}
    ></iframe>
  );
}
