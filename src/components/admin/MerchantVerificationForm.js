import React from 'react';

function MerchantVerificationForm() {
  return (
    <div>
      <h1>Merchant Verification</h1>
      <p>Review and approve/reject merchant applications below:</p>
      <form>
        <label>
          Merchant Name:
          <input type="text" value="Example Merchant" readOnly />
        </label>
        <br />
        <label>
          Business Registration Document:
          <a href="/example-doc.pdf" target="_blank" rel="noopener noreferrer">View Document</a>
        </label>
        <br />
        <button type="button">Approve</button>
        <button type="button">Reject</button>
      </form>
    </div>
  );
}

export default MerchantVerificationForm;
