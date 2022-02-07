<script>
  import FileInput from "./FileInput.svelte";
  import ColorSelect from './ColorSelect.svelte';
  import domtoimage from 'dom-to-image';

  export let timelineNode;
  let fileChosen = false;
</script>

<FileInput bind:fileChosen />
  
<button disabled={!fileChosen} title={fileChosen ? '' : 'Choose a file first'} on:click={() => {
  domtoimage.toBlob(timelineNode)
  .then(blob => {
    const downloadLink = document.createElement('a');

    try {
      // This fails when the image is too large
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = 'timeline.png';
      downloadLink.click();
      window.URL.revokeObjectURL(url);
      downloadLink.remove();
    }
    catch (err) {
      alert("Sorry, your timeline is too large to export as an image.");
    }
  });
}}>Export as png</button>

<ColorSelect />