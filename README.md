# 🧮 Aljabar Linear Solver (ALS)

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Solver & Calculator Aljabar Linear dengan Langkah-Langkah Detail**

[🚀 Live Demo](https://als-84.vercel.app) · [📖 Report Bug](https://github.com/Kaioryo/ALS/issues) · [✨ Request Feature](https://github.com/Kaioryo/ALS/issues)

</div>

---

## 📖 Tentang Proyek

**Aljabar Linear Solver (ALS)** adalah aplikasi web interaktif yang dirancang untuk membantu mahasiswa dan pelajar memahami konsep-konsep aljabar linear melalui **solver otomatis dengan langkah-langkah detail**. Aplikasi ini menyediakan berbagai tools untuk menyelesaikan masalah aljabar linear, dari sistem persamaan linear hingga diagonalisasi matriks.

### 🎯 Tujuan

- Menyediakan solver aljabar linear yang **mudah digunakan**
- Menampilkan **proses penyelesaian step-by-step**
- Mendukung pembelajaran mandiri dengan **materi PDF terintegrasi**
- Memberikan pengalaman UI/UX yang **modern dan responsif**

---

## ✨ Fitur Utama

### 🔢 Computational Tools

| Fitur | Deskripsi |
|-------|-----------|
| **📐 Gram-Schmidt Process** | Ubah basis menjadi basis ortonormal dengan HKD kustom (Euclid/Weighted) |
| **🔢 SPL & Matrix Solver** | Operasi Baris Elementer (OBE) dengan langkah detail |
| **📊 Inner Product & HKD** | Hitung hasil kali dalam, norm, jarak, proyeksi, dan cek ortogonalitas |
| **🎯 Projection & Least Squares** | Hitung proyeksi ortogonal dan solusi least squares Ax ≈ b |
| **🧩 Subspace Analysis** | Cek independensi linear, basis, dan dimensi subspace |
| **🧬 Eigenvalue & Eigenvector** | Hitung nilai eigen dan vektor eigen untuk matriks 2×2 dan 3×3 |
| **♦️ Diagonalization** | Cari matriks P dan D sehingga A = PDP⁻¹ |

### 📚 Learning Materials

- **Materi PDF Interaktif**: Akses slide kuliah per pertemuan dengan viewer bawaan
- **Step-by-Step Solutions**: Setiap solver menampilkan langkah penyelesaian detail
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile

---

## 🚀 Demo

🌐 **Live Application**: [https://als-84.vercel.app](https://als-84.vercel.app)

### Fitur-Fitur Interface

- **Navigation Bar** dengan akses cepat ke semua tools
- **Home Page** dengan menu tool dalam bentuk card
- **Input Form** yang intuitif dengan kontrol dimensi dan mode
- **Output Display** dengan hasil perhitungan dan langkah-langkah
- **PDF Viewer** terintegrasi untuk akses materi pembelajaran

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI Library
- **React Router v6** - Client-side routing
- **@react-pdf-viewer** - PDF rendering
- **pdfjs-dist** - PDF processing

### Styling

- **CSS3** - Custom styling dengan variabel CSS
- **Responsive Design** - Mobile-first approach

### Deployment

- **Vercel** - Hosting dan continuous deployment

---

## 📦 Installation

### Prerequisites

- Node.js >= 14.x
- npm atau yarn

### Clone Repository

```bash
git clone https://github.com/Kaioryo/ALS.git
cd ALS
```

### Install Dependencies

```bash
npm install
# atau
yarn install
```

### Run Development Server

```bash
npm start
# atau
yarn start
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build untuk Production

```bash
npm run build
# atau
yarn build
```

---

## 📁 Struktur Proyek

```
ALS/
├── public/
│   ├── pdf/                 # Folder berisi file PDF materi
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.js       # Navigation bar
│   ├── pages/
│   │   ├── HomePage.js     # Landing page dengan menu
│   │   ├── SPLSolverPage.js
│   │   ├── GramSchmidtPage.js
│   │   ├── InnerProductPage.js
│   │   ├── ProjectionPage.js
│   │   ├── SubspacePage.js
│   │   ├── EigenPage.js
│   │   ├── DiagonalizationPage.js
│   │   ├── MateriPDFPage.js
│   │   └── PDFViewerPage.js
│   ├── data/
│   │   └── materiData.js   # Data materi PDF
│   ├── utils/              # Helper functions & algorithms
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

---

## 🎓 Cara Penggunaan

### 1️⃣ Pilih Tool yang Diinginkan

Dari halaman utama, klik salah satu card untuk mengakses solver:
- Gram-Schmidt Process
- SPL & Matrix Solver
- Inner Product & HKD
- Projection & Least Squares
- Subspace Analysis
- Eigenvalue & Eigenvector
- Diagonalization

### 2️⃣ Input Data

- Atur **dimensi** atau **ukuran matriks** sesuai kebutuhan
- Masukkan **nilai-nilai** pada input field yang tersedia
- Pilih **mode** atau **metode** jika tersedia

### 3️⃣ Hitung Solusi

Klik tombol **Hitung** atau **Solve** untuk mendapatkan hasil dengan langkah-langkah detail

### 4️⃣ Akses Materi Pembelajaran

Klik menu **Materi PDF** untuk mengakses slide kuliah per pertemuan

---

## 🤝 Contributing

Kontribusi sangat diterima! Jika kamu ingin berkontribusi:

1. **Fork** repository ini
2. **Create** branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. Buka **Pull Request**

---

## 🐛 Known Issues

- [ ] Matriks besar (>5×5) mungkin lambat pada komputasi kompleks
- [ ] PDF viewer mungkin memerlukan beberapa saat untuk loading pertama kali

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Kaioryo**

- GitHub: [@Kaioryo](https://github.com/Kaioryo)
- Project Link: [https://github.com/Kaioryo/ALS](https://github.com/Kaioryo/ALS)

---

## 🙏 Acknowledgments

- Slide kuliah dari **Program Studi S1 Matematika FMIPA Unpad**
- Dosen pengampu: Dr. Edi Kurniadi, M.Si., Ph.D., Dr. Sisilia Sylviani, M.Si., Dr. Anita Triska, M.Si.
- Inspirasi UI/UX dari berbagai educational platform
- Icons dari emoji dan Unicode characters

---

<div align="center">

**⭐ Star repo ini jika bermanfaat!**

Made with 💜 for Aljabar Linear learners

</div>