
<script>
  import { sheetData, events } from './stores';
  import Modal from './Modal.svelte';
  import { DateTime } from 'luxon';
  import { read as XLSXRead, utils as XLSXUtils } from "xlsx";

  let open = false;
  let badDateCol = false;
  let workbook;
  export let fileChosen = false;

  $: columnHeaders = workbook ? Object.entries(XLSXUtils.sheet_to_json(workbook.Sheets[$sheetData.sheet])[0]) : [];
  // Object.entries(workbook.Sheets[$sheetData.sheet]).filter(cell => cell[0].match(/[A-Z]+1$/))

  function UploadProcess(fileInput) {
    //Validate whether File is valid Excel file.
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx|.csv)$/;
    if (regex.test(fileInput.value.toLowerCase())) {
      if (typeof FileReader != "undefined") {
        const reader = new FileReader();

        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
          reader.onload = e => {
            GetTableFromExcel(e.target.result);
          };
          reader.readAsBinaryString(fileInput.files[0]);
        } else {
          //For IE Browser.
          reader.onload = function (e) {
            let data = "";
            const bytes = new Uint8Array(e.target.result);
            for (const i = 0; i < bytes.byteLength; i++) {
              data += String.fromCharCode(bytes[i]);
            }
            GetTableFromExcel(data);
          };
          reader.readAsArrayBuffer(fileInput.files[0]);
        }
      }
      else {
        alert("This browser does not support HTML5.");
      }
    }
    else if (fileInput.files.length) {
      alert("Sorry, that file format is not supported.");
    }
  }

  function GetTableFromExcel(data) {
    //Read the Excel File data in binary
    workbook = XLSXRead(data, {
      type: "binary",
    });

    // Set to the first sheet so the select isn't blank
    $sheetData.sheet = workbook.SheetNames[0];
    fileChosen = true;

    open = true;
  }
</script>

<Modal required={true} bind:open on:close={() => {
  $events = XLSXUtils.sheet_to_json(workbook.Sheets[$sheetData.sheet]);
  }}>
  <form>
    <h1>Select columns</h1>
    <label for="sheetSelect">Select sheet</label>
    <select id="sheetSelect" bind:value={$sheetData.sheet}>
      {#each workbook.SheetNames as sheetName}
        <option value={sheetName}>{sheetName}</option>
      {/each}
    </select>

    <label for="dateSelect">Column for date *</label>
    <select id="dateSelect" required bind:value={$sheetData.dateColumn} on:input={e => {
      badDateCol = false;

      let hasNumber = 0;
      for (const i of XLSXUtils.sheet_to_json(workbook.Sheets[$sheetData.sheet])) {
        if (!DateTime.fromISO(i[e.target.value]).invalid) {
          hasNumber++;
        }
      }
      if (hasNumber < 2) { // Has to have at least two numbers for the range and everything to work
        badDateCol = true;
      }
      }}>
      {#if workbook.Sheets[$sheetData.sheet]}
        {#each columnHeaders as header}
          <option value={header[0]}>{header[0]}</option>
        {/each}
      {/if}
    </select>
    {#if badDateCol}
      <p>The date column you selected<br>contains fewer than two valid dates</p>
    {/if}
    
    <label for="titleSelect">Column for title</label>
    <select id="titleSelect" bind:value={$sheetData.titleColumn}>
      <option value="illegal/sheetname">None (default)</option>
      {#if workbook.Sheets[$sheetData.sheet]}
        {#each columnHeaders as header}
          <option value={header[0]}>{header[0]}</option>
        {/each}
      {/if}
    </select>

    <label for="descriptionSelect">Column for description</label>
    <select id="descriptionSelect" bind:value={$sheetData.descriptionColumn}>
      <option value="illegal/sheetname">None (default)</option>
      {#if workbook.Sheets[$sheetData.sheet]}
        {#each columnHeaders as header}
          <option value={header[0]}>{header[0]}</option>
        {/each}
      {/if}
    </select>

    <br>
    <br>
    <button on:click={e => {
      // If you return before the preventDefault, the built-in warning pops up
      if (!document.querySelector('#dateSelect').value || badDateCol) {
        return;
      }
      e.preventDefault();
      open = false;
    }}>Done</button>
  </form>
</Modal>

<form>
  <input
    id="fileInput"
    type="file"
    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
    on:input={() => {
      UploadProcess(document.querySelector('#fileInput'));
    }}
  />
</form>

<button title={fileChosen ? 'Change the displayed columns' : 'Choose a file first'} disabled={!fileChosen} on:click={() => {
  open = true;
}}>Sheet options</button>

<style>
  @media print {
    form {
      visibility: hidden;
    }
  }
</style>
