<svelte:head>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js"></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/jszip.js"></script>
</svelte:head>

<script>
  import { sheetData, events } from './stores';
  import Modal from './Modal.svelte';

  let open = false;
  let badDateCol = false;
  let workbook;
  let fileChosen = false;

  $: columnHeaders = workbook ? Object.entries(XLSX.utils.sheet_to_json(workbook.Sheets[$sheetData.sheet])[0]) : [];
  // Object.entries(workbook.Sheets[$sheetData.sheet]).filter(cell => cell[0].match(/[A-Z]+1$/))

  function UploadProcess(fileInput) {

    //Validate whether File is valid Excel file.
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileInput.value.toLowerCase())) {
      if (typeof FileReader != "undefined") {
        const reader = new FileReader();

        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
          reader.onload = function (e) {
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
      } else {
        // alert("This browser does not support HTML5.");
      }
    } else {
      // alert("Please upload a valid Excel file.");
    }
  }

  function GetTableFromExcel(data) {
    //Read the Excel File data in binary
    workbook = XLSX.read(data, {
      type: "binary",
    });

    // Set to the first sheet so the select isn't blank
    $sheetData.sheet = workbook.SheetNames[0];
    fileChosen = true;

    open = true;
  }
</script>

<!-- svelte-ignore missing-declaration -->
<Modal required={true} bind:open on:close={() => {
  $events = XLSX.utils.sheet_to_json(workbook.Sheets[$sheetData.sheet]);
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

      // TODO make it work with dates and not just numbers
      let hasNumber = 0;
      for (const i of XLSX.utils.sheet_to_json(workbook.Sheets[$sheetData.sheet])) {
        if (!isNaN(i[e.target.value])) {
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
      <p>The date column you selected<br>contains less than two numbers</p>
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

<button on:click={() => {
  fileChosen && (open = true);
}}>Change columns</button>

<style>
  @media print {
    form {
      visibility: hidden;
    }
  }
</style>
