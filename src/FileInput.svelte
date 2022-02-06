<svelte:head>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js"></script>
  <script
    type="text/javascript"
    src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/jszip.js"></script>
</svelte:head>

<script>
  import { events } from './stores';

  function UploadProcess(fileInput) {

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileInput.value.toLowerCase())) {
      if (typeof FileReader != "undefined") {
        var reader = new FileReader();

        //For Browsers other than IE.
        if (reader.readAsBinaryString) {
          reader.onload = function (e) {
            GetTableFromExcel(e.target.result);
          };
          reader.readAsBinaryString(fileInput.files[0]);
        } else {
          //For IE Browser.
          reader.onload = function (e) {
            var data = "";
            var bytes = new Uint8Array(e.target.result);
            for (var i = 0; i < bytes.byteLength; i++) {
              data += String.fromCharCode(bytes[i]);
            }
            GetTableFromExcel(data);
          };
          reader.readAsArrayBuffer(fileInput.files[0]);
        }
      } else {
        alert("This browser does not support HTML5.");
      }
    } else {
      alert("Please upload a valid Excel file.");
    }
  }

  function GetTableFromExcel(data) {
    //Read the Excel File data in binary
    var workbook = XLSX.read(data, {
      type: "binary",
    });

    //get the name of First Sheet.
    var Sheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    $events = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[Sheet]
    );
  }
</script>
<form>
  <input
    id="fileInput"
    type="file"
    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
  />

  <button on:click={e => {
    e.preventDefault();
    UploadProcess(document.querySelector('#fileInput'));
  }}>Upload</button>
</form>

<style>
  @media print {
    form {
      visibility: hidden;
    }
  }
</style>
