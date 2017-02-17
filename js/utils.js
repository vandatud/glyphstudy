define({
  urlParam: function(name) {
    var results = new RegExp("[\?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    } else {
      return results[1] || 0;
    }
  },
  downloadURL: function(url) {
    var hiddenIFrameID = "hiddenDownloader",
      iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
      iframe = document.createElement("iframe");
      iframe.id = hiddenIFrameID;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    iframe.src = url;
  },
  saveTextAsFile: function(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = "document.body.removeChild(event.target)";
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  },
  translate: function(word) {
    var mapping = {};
    mapping["EstimationMusic"] = "Mit Musik";
    mapping["Price"] = "Preis";
    mapping["Time"] = "Zeit";
    mapping["Distance"] = "Entfernung";
    mapping["Popularity"] = "Popularität";
    mapping["Category"] = "Kategorie";

    if(!(word in mapping)) return word;

    return mapping[word];
  },
  eventElement: function(id, withHash = true) {
    if (withHash) {
      return "#event_" + id;
    } else {
      return "event_" + id;
    }    
  }
});
