import React, { useState } from "react";

const PAGE_CSS = `
// SAME CSS again
`;

export function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const FAQS = [
    // SAME FAQ ARRAY
  ];

  return (
    <>
      <style>{PAGE_CSS}</style>
      {/* FULL SAME JSX */}
    </>
  );
}

export default Help;