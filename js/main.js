function QI(x, x_mid, x_up) {
    return x.map((xi, i) => Math.min(100, 100*Math.abs(xi - x_mid[i]) / (x_up[i] - x_mid[i])));
  }

function result(x) {
    if (x < 30) {
      return 'Poor';
    } else if (x < 50) {
      return 'Marginal';
    } else if (x < 80) {
      return 'Fair';
    } else {
      return 'Good';
    }
  }

  function choose_style(x) {
    if (x < 30) {
      return 'red';
    } else if (x < 50) {
      return 'brown';
    } else if (x < 80) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  function colour(x) {
    const { PDFDocument, rgb } = PDFLib;
    const green=rgb(197/255,224/255,179/255);
    const yellow=rgb(1, 229/255, 153/255);
    const brown=rgb(247/255,202/255,172/255);
    const red=rgb(1, 137/255,137/255);
    if (x < 30) {
      return red;
    } else if (x < 50) {
      return brown;
    } else if (x < 80) {
      return yellow;
    } else {
      return green;
    }
  }

document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
    //event.preventDefault();
    //Low Up parametrs
    const p_up=[9,5,45,10,1500,350,500,0.3,0.7,1]
    const p_mid=[7.5,0,0,7,875,0,0,0,0,0]
    // Get values of each parameter
    let first = document.getElementById('first').value;
    let last = document.getElementById('last').value;
    let email = document.getElementById('email').value;
    let office = document.getElementById('office').value;

    // Check if any required fields are empty
    if (!first || !last || !email || !office) {
        alert("Please fill in all required fields as your name, email and office.");
        return;
    }
    
    const ph = parseFloat(document.getElementById('ph').value) || 0;
    const oxidizing = parseFloat(document.getElementById('oxidizing').value) || 0;
    const no3 = parseFloat(document.getElementById('no3').value) || 0;
    const hardness = parseFloat(document.getElementById('hardness').value) || 0;
    const tss = parseFloat(document.getElementById('tss').value) || 0;
    const cl = parseFloat(document.getElementById('cl').value) || 0;
    const so4 = parseFloat(document.getElementById('so4').value) || 0;
    const fe = parseFloat(document.getElementById('fe').value) || 0;
    const f = parseFloat(document.getElementById('f').value) || 0;
    const cu = parseFloat(document.getElementById('cu').value) || 0;

    // Calculate the sum of all values
    const parametrs=[ph,oxidizing,no3,hardness,tss,cl,so4,fe,f,cu]
    const si=QI(parametrs,p_mid,p_up)
    const ss = si.map(value => Math.exp(value / 100)-1);
    const S = ss.reduce((acc, val) => acc + val, 0);
    const w = ss.map(value => value / S);
    const wqi = w.reduce((acc, wi,i)=>acc+wi*si[i],0);
    const WQI = 100-Math.max(0,wqi);

    // Display the result in the result box
    const resultBox = document.getElementById('result-box');
    resultBox.innerText =  WQI.toFixed(0)+'  '+result(WQI); //

    resultBox.classList.remove('green', 'yellow', 'brown', 'red');
    const chosenStyle = choose_style(WQI);
    resultBox.classList.add(chosenStyle);

  //Write PDF document
  generatePDF(ph,oxidizing,no3,hardness,tss,cl,so4,fe,f,cu,WQI.toFixed(0))

  //send form

  // URL of the Google Form's action
  const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdpMbE6CLKF4v51Lm1sTtYZQk1Jv-FRbVT7IZ-zyNKfo0TNZw/formResponse";
  // Prepare the data to be submitted (entry.xxxxx should match Google's field names)
  let formData = new FormData();
  formData.append('entry.434683221', last);
  formData.append('entry.1340002733', first);
  formData.append('entry.859218483', email);
  formData.append('entry.1300176277', office);
  //ph,oxidizing,no3,hardness,tss,cl,so4,fe,f,cu
  formData.append('entry.507319800', ph);
  formData.append('entry.1251398729', oxidizing);
  formData.append('entry.170735898', no3);
  formData.append('entry.606171558', hardness);
  formData.append('entry.214006383', tss);
  formData.append('entry.1056698573', cl);
  formData.append('entry.1278441196', so4);
  formData.append('entry.226121631', fe);
  formData.append('entry.919169081', f);
  formData.append('entry.856411756', cu);
  formData.append('entry.1793892489', WQI.toFixed(0));
  formData.append('entry.1491637305', result(WQI));

  // Submit the data to Google Form
  fetch(googleFormUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
    }).then(() => {
    }).catch((error) => {
        console.error('Error!', error.message);
    });


});

document.querySelector('button[type="reset"]').addEventListener('click', function() {
    // Clear the result box and reset its color when the form is reset
    const resultBox = document.getElementById('result-box');
    resultBox.innerText = '';
    resultBox.classList.remove('green', 'yellow', 'brown', 'red');
});

function toggleNavBar() {
  var navbar = document.getElementById("navbar");

  // Toggle the active class to show or hide the links
  if (navbar.classList.contains("active")) {
      navbar.classList.remove("active");
  } else {
      navbar.classList.add("active");
  }
}

async function generatePDF(ph,oxidizing,no3,hardness,tss,cl,so4,fe,f,cu,WQI) {
const { PDFDocument, rgb } = PDFLib;

// Fetch the existing PDF
const url = 'Doc.pdf'; // Path to your uploaded PDF
const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

// Load the PDF into PDFLib
const pdfDoc = await PDFDocument.load(existingPdfBytes);

// Get the first page of the document
const pages = pdfDoc.getPages();
const firstPage = pages[0];


// Add text to the specific locations in the PDF (x, y coordinates are placeholders)
firstPage.drawText(`${ph}`, { x: 255, y: 315, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${oxidizing}`, {x: 255, y: 303, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${no3}`, { x: 255, y: 291, size: 8, color: rgb(0, 0, 0)  });
firstPage.drawText(`${hardness}`, { x: 255, y: 279, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${tss}`, { x: 255, y: 267, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${cl}`, { x: 255, y: 255, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${so4}`, { x: 255, y: 243, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${fe}`, { x: 255, y: 231, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${f}`, { x: 255, y: 219, size: 8, color: rgb(0, 0, 0) });
firstPage.drawText(`${cu}`, { x: 255, y: 207, size: 8, color: rgb(0, 0, 0) });

// Get the dimensions of the page to place the rectangle in the middle
const { width, height } = firstPage.getSize();

// Calculate the position to center the rectangle
const rectWidth = 232;
const rectHeight = 118;
const x = (width +228- rectWidth) / 2; // Center horizontally
const y = (height-314 - rectHeight) / 2; // Center vertically

// Draw a red rectangle in the center of the page
firstPage.drawRectangle({
    x: x, // X coordinate (centered)
    y: y, // Y coordinate (centered)
    width: rectWidth, // Rectangle width
    height: rectHeight, // Rectangle height
    color: colour(WQI), // Red color (RGB)
});

//Write results in rectangle
firstPage.drawText(`${WQI}`, { x: x+rectWidth/2-15, y: y+rectHeight/2+20, size: 12, color: rgb(0, 0, 0) });
firstPage.drawText(result(WQI), { x: x+rectWidth/2-20, y: y+rectHeight/2, size: 12, color: rgb(0, 0, 0) });

// Serialize the PDF document to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save();

// Trigger the download
const blob = new Blob([pdfBytes], { type: 'application/pdf' });
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'DUAWQI-result.pdf';
link.click();
}
