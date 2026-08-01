"use client";

export default function Button() {
  function buttonKlik() {
    alert("Maryati Geber !!");
  }
  return (
    <>
      <button onClick={buttonKlik}>Klik Disini</button>
    </>
  );
}
