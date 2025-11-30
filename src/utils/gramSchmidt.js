// Helper: format angka untuk tampilan
function formatNumber(num) {
  if (Number.isNaN(num)) return 'NaN';

  // Hampir nol
  if (Math.abs(num) < 1e-6) return '0';

  // Hampir 1 atau -1
  if (Math.abs(num - 1) < 1e-6) return '1';
  if (Math.abs(num + 1) < 1e-6) return '-1';

  // Hampir bilangan bulat lain
  const roundedInt = Math.round(num);
  if (Math.abs(num - roundedInt) < 1e-6) return roundedInt.toString();

  // Default: 4 desimal
  return num.toFixed(4);
}

export function gramSchmidt(vectors, hkdType = 'euclid', weights = []) {
  const steps = [];

  // Simpan versi numerik dan versi tampilan terpisah
  const orthogonalNum = [];   // w_i (numerik)
  const orthonormalNum = [];  // v_i (numerik)
  const orthogonalView = [];  // w_i (string)
  const orthonormalView = []; // v_i (string)

  // Inner product
  const innerProduct = (u, v) => {
    if (hkdType === 'weighted') {
      return u.reduce((sum, ui, i) => sum + (weights[i] ?? 1) * ui * v[i], 0);
    }
    return u.reduce((sum, ui, i) => sum + ui * v[i], 0);
  };

  const norm = (v) => Math.sqrt(innerProduct(v, v));

  // Cek input kosong / tidak ada vektor
  if (!vectors || vectors.length === 0) {
    return { steps: [], orthonormal: [], orthogonal: [] };
  }

  // ===== Langkah 1: v1 =====
  const u1 = vectors[0];
  const norm_u1 = norm(u1);
  const v1Num = u1.map((x) => x / norm_u1);

  orthogonalNum.push([...u1]);
  orthonormalNum.push(v1Num);

  orthogonalView.push(u1.map(formatNumber));
  orthonormalView.push(v1Num.map(formatNumber));

  steps.push({
    title: 'Langkah 1: Normalisasi v₁',
    calculations: [
      `u₁ = (${u1.map(formatNumber).join(', ')})`,
      `||u₁|| = √⟨u₁,u₁⟩ = √${formatNumber(innerProduct(u1, u1))} = ${formatNumber(norm_u1)}`,
      `v₁ = u₁/||u₁|| = (${v1Num.map(formatNumber).join(', ')})`,
    ],
  });

  // ===== Langkah i >= 2 =====
  for (let i = 1; i < vectors.length; i++) {
    const ui = vectors[i];
    let wiNum = [...ui]; // numerik

    const stepCalcs = [`u${i + 1} = (${ui.map(formatNumber).join(', ')})`];

    // Kurangi semua proyeksi ke v1,...,v_i-1
    for (let j = 0; j < i; j++) {
      const vjNum = orthonormalNum[j];
      const projCoeff = innerProduct(ui, vjNum);

      stepCalcs.push(`⟨u${i + 1}, v${j + 1}⟩ = ${formatNumber(projCoeff)}`);
      if (Math.abs(projCoeff) > 1e-8) {
        stepCalcs.push(
          `proyeksi ke v${j + 1} = ${formatNumber(projCoeff)} · v${j + 1}`
        );
      }

      wiNum = wiNum.map((w, k) => w - projCoeff * vjNum[k]);
    }

    const wiView = wiNum.map(formatNumber);
    stepCalcs.push(
      `w${i + 1} = u${i + 1} - proyeksi = (${wiView.join(', ')})`
    );

    const norm_wi = norm(wiNum);
    const viNum = wiNum.map((x) => x / norm_wi);
    const viView = viNum.map(formatNumber);

    stepCalcs.push(`||w${i + 1}|| = ${formatNumber(norm_wi)}`);
    stepCalcs.push(
      `v${i + 1} = w${i + 1}/||w${i + 1}|| = (${viView.join(', ')})`
    );

    orthogonalNum.push(wiNum);
    orthonormalNum.push(viNum);
    orthogonalView.push(wiView);
    orthonormalView.push(viView);

    steps.push({
      title: `Langkah ${i + 1}: Hitung v${i + 1}`,
      calculations: stepCalcs,
    });
  }

  // Hasil akhir: pakai versi view (string) agar rapi
  return {
    steps,
    orthonormal: orthonormalView,
    orthogonal: orthogonalView,
  };
}
