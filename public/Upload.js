const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Allowed file types (example: images + PDFs)
const allowedTypes = /jpeg|jpg|png|gif|pdf/;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

// File validation
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and PDFs are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

// Serve upload form
app.get("/", (req, res) => {
  res.send(`
    <h2>Upload a File</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(`✅ File uploaded successfully: ${req.file.filename}`);
  } catch (err) {
    res.status(500).send("❌ Upload error: " + err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
