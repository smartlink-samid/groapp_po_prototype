(function () {
  const customers = [
    { id: "cust-1", name: "PT Kopi Retail Indonesia", phone: "021-9900-1188", email: "ap@kopiretail.id", address: "Jl. Gatot Subroto No. 18, Jakarta", bankName: "Bank BCA", accountHolder: "PT Kopi Retail Indonesia", accountNumber: "1280099911" },
    { id: "cust-2", name: "CV Langganan Sejahtera", phone: "031-8811-7788", email: "finance@langganansejahtera.id", address: "Jl. Basuki Rahmat No. 42, Surabaya", bankName: "Bank Mandiri", accountHolder: "CV Langganan Sejahtera", accountNumber: "140001882211" },
    { id: "cust-3", name: "Hotel Nusantara Group", phone: "022-5566-7788", email: "purchasing@hotelnusantara.id", address: "Jl. Asia Afrika No. 25, Bandung", bankName: "Bank BRI", accountHolder: "Hotel Nusantara Group", accountNumber: "002101778899" },
    { id: "cust-4", name: "Kafe Sinar Pagi", phone: "0274-664-221", email: "owner@sinarpagi.id", address: "Jl. Kaliurang KM 5, Yogyakarta", bankName: "", accountHolder: "", accountNumber: "" },
    { id: "cust-5", name: "Koperasi Mitra Flores", phone: "0380-887-221", email: "mitra@flores.id", address: "Jl. Timor Raya No. 8, Kupang", bankName: "Bank NTT", accountHolder: "Koperasi Mitra Flores", accountNumber: "020100887221" }
  ];

  const catalog = [
    {
      id: "prod-coffee-milk", type: "Produk", name: "Kopi Susu Botol", sellable: true,
      variants: [
        { id: "var-250", name: "Original 250 ml", unit: "Botol", price: 18000, barcode: "899700100001" },
        { id: "var-1l", name: "Original 1 Liter", unit: "Botol", price: 65000, barcode: "899700100002" },
        { id: "var-less", name: "Less Sugar 250 ml", unit: "Botol", price: 19000, barcode: "899700100003" }
      ]
    },
    {
      id: "prod-beans", type: "Produk", name: "Biji Kopi Roasted Arabika", sellable: true,
      variants: [
        { id: "var-gayo-250", name: "Gayo 250 gr", unit: "Pouch", price: 85000, barcode: "899700200001" },
        { id: "var-gayo-1k", name: "Gayo 1 kg", unit: "Pouch", price: 300000, barcode: "899700200002" },
        { id: "var-flores-250", name: "Flores 250 gr", unit: "Pouch", price: 82000, barcode: "899700200003" }
      ]
    },
    { id: "prod-tumbler", type: "Produk", name: "Merchandise Tumbler", sellable: true, unit: "Pcs", price: 125000, barcode: "899700300001", variants: [] },
    { id: "prod-drip", type: "Produk", name: "Kopi Drip Bag", sellable: true, unit: "Box", price: 95000, barcode: "899700300002", variants: [] },
    { id: "svc-break", type: "Jasa", name: "Paket Coffee Break", sellable: true, unit: "Pax", price: 45000, variants: [] },
    { id: "svc-machine", type: "Jasa", name: "Sewa Mesin Kopi", sellable: true, unit: "Hari", price: 500000, variants: [] },
    { id: "svc-barista", type: "Jasa", name: "Barista untuk Acara", sellable: true, unit: "Hari", price: 750000, variants: [] }
  ];

  const steps = ["Informasi Nota", "Pelanggan", "Produk atau Jasa", "Pembayaran", "Preview"];
  const receiverAccounts = [
    { id: "bca", label: "BCA Operasional", number: "1280098877", owner: "PT Kopi Nusantara Indonesia" },
    { id: "mandiri", label: "Mandiri Bisnis", number: "140001112233", owner: "PT Kopi Nusantara Indonesia" },
    { id: "bri", label: "BRI Utama", number: "002101887766", owner: "Unit Roastery Kopi Nusantara" }
  ];
  let state = null;
  let lineId = 1;
  let publishCreateAnother = false;

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function numberLabel(value) {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.max(Number(value) || 0, 0));
  }

  function parseMoney(value) {
    return Number(String(value ?? "").replace(/[^0-9]/g, "")) || 0;
  }

  function rupiahInput(value, attributes) {
    return `<div class="rupiah-input"><span>Rp</span><input type="text" inputmode="numeric" value="${numberLabel(value)}" ${attributes || ""} /></div>`;
  }

  function nowLabel() {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date());
  }

  function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function blankState(type) {
    const source = typeof activeSourceData === "function" ? activeSourceData() : "Perusahaan Kopi Nusantara";
    const base = {
      mode: type,
      step: 1,
      dirty: false,
      source,
      code: nextCode(),
      transactionDate: localDateString(today),
      createdAt: nowLabel(),
      customerId: "",
      customerQuery: "",
      productQuery: "",
      items: [],
      transactionDiscountType: "percent",
      transactionDiscountValue: 0,
      transactionTax: "none",
      fee: 0,
      note: "",
      attachments: [],
      paymentType: "full",
      paymentMethod: "cash",
      paymentDate: localDateString(today),
      paymentAmount: 0,
      dueDate: "",
      cashAccount: "Kas Utama",
      cashReceived: 0,
      receiverAccount: "bca",
      senderBankName: "",
      senderAccountHolder: "",
      senderAccountNumber: "",
      saveSenderAccount: true,
      paymentEvidence: ""
    };

    if (type === "edit") {
      const inv = invoices.find(item => item.id === selectedId);
      if (!inv) return base;
      let customer = customers.find(item => item.name === inv.vendor);
      if (!customer) {
        customer = { id: `cust-${Date.now()}`, name: inv.vendor, phone: "-", email: "", address: "Alamat pelanggan belum dilengkapi", bankName: "", accountHolder: "", accountNumber: "" };
        customers.push(customer);
      }
      return {
        ...base,
        source: inv.sourceData,
        code: inv.code,
        transactionDate: inv.date,
        customerId: customer.id,
        items: inv.items.map(item => ({
          id: `line-${lineId++}`,
          catalogId: item.catalogId || "legacy",
          type: item.type || "Produk",
          product: item.product,
          variant: item.variant || "",
          unit: item.unit || "Unit",
          qty: item.qty,
          price: item.price,
          discountType: item.discountType || "percent",
          discountValue: item.discountValue || 0,
          taxType: item.taxType || "none",
          note: item.note || item.desc || ""
        })),
        transactionDiscountType: inv.transactionDiscountType || "nominal",
        transactionDiscountValue: inv.transactionDiscountValue || inv.discount || 0,
        transactionTax: inv.transactionTax || "none",
        fee: inv.fee || 0,
        note: inv.note || "",
        dueDate: inv.dueDate || ""
      };
    }
    return base;
  }

  function selectedCustomer() {
    return customers.find(item => item.id === state.customerId) || null;
  }

  function discountAmount(base, type, value) {
    const amount = type === "percent" ? base * Math.min(Math.max(Number(value) || 0, 0), 100) / 100 : Math.max(Number(value) || 0, 0);
    return Math.min(amount, base);
  }

  function taxRate(type) {
    if (type === "ppn") return 0.11;
    if (type === "pph") return -0.10;
    return 0;
  }

  function calculation() {
    const itemParts = state.items.map(item => {
      const gross = Math.max(Number(item.qty) || 0, 0) * Math.max(Number(item.price) || 0, 0);
      const itemDiscount = discountAmount(gross, item.discountType, item.discountValue);
      return { item, gross, itemDiscount, afterItemDiscount: gross - itemDiscount };
    });
    const subtotal = itemParts.reduce((sum, part) => sum + part.gross, 0);
    const itemDiscount = itemParts.reduce((sum, part) => sum + part.itemDiscount, 0);
    const afterItemDiscount = itemParts.reduce((sum, part) => sum + part.afterItemDiscount, 0);
    const transactionDiscount = discountAmount(afterItemDiscount, state.transactionDiscountType, state.transactionDiscountValue);
    const taxableBase = Math.max(afterItemDiscount - transactionDiscount, 0);
    let tax = 0;

    if (state.transactionTax !== "none") {
      tax = taxableBase * taxRate(state.transactionTax);
    } else if (afterItemDiscount > 0) {
      tax = itemParts.reduce((sum, part) => {
        const allocatedTransactionDiscount = transactionDiscount * (part.afterItemDiscount / afterItemDiscount);
        const itemTaxBase = Math.max(part.afterItemDiscount - allocatedTransactionDiscount, 0);
        return sum + itemTaxBase * taxRate(part.item.taxType);
      }, 0);
    }

    const fee = Math.max(Number(state.fee) || 0, 0);
    const total = Math.max(taxableBase + tax + fee, 0);
    return { subtotal, itemDiscount, transactionDiscount, totalDiscount: itemDiscount + transactionDiscount, tax: Math.round(tax), fee, total: Math.round(total) };
  }

  function setDirty() {
    state.dirty = true;
  }

  function wizardShell() {
    return `
      <div class="wizard-top card panel">
        <div class="section-head wizard-heading">
          <div>
            <div class="eyebrow">TRANSAKSI PENJUALAN</div>
            <h1 class="panel-title">${state.mode === "edit" ? "Ubah" : "Tambah"} Penjualan</h1>
            <div class="sub-text">Lengkapi transaksi secara bertahap. Data tidak akan hilang saat berpindah tahap.</div>
          </div>
          <button class="btn btn-ghost" onclick="salesExitWizard()">✕ Tutup</button>
        </div>
        <div class="wizard-stepper">
          ${steps.map((label, index) => {
            const number = index + 1;
            const cls = number === state.step ? "active" : number < state.step ? "done" : "";
            return `<button type="button" class="wizard-step ${cls}" onclick="salesJumpStep(${number})" ${number > state.step ? "disabled" : ""}>
              <span>${number < state.step ? "✓" : number}</span><small>${label}</small>
            </button>`;
          }).join("")}
        </div>
      </div>
      <div class="wizard-body">${stepContent()}</div>
      ${customerModal()}
      ${publishModal()}
    `;
  }

  function stepContent() {
    if (state.step === 1) return stepNote();
    if (state.step === 2) return stepCustomer();
    if (state.step === 3) return stepItems();
    if (state.step === 4) return stepPayment();
    return stepPreview();
  }

  function stepNote() {
    return `
      <div class="card panel wizard-card">
        <div class="wizard-section-title"><span>1</span><div><h2>Informasi Nota</h2><p>Nomor nota mengikuti sumber data aktif dan baru dipakai setelah transaksi disimpan.</p></div></div>
        <div class="source-lock"><div><strong>${esc(state.source)}</strong><span>Sumber data aktif dari halaman Daftar Penjualan</span></div><span class="lock-pill">🔒 Tidak dapat diubah</span></div>
        <div class="form-grid wizard-form-grid">
          <div class="field"><label>No. Nota</label><input class="disabled" value="${esc(state.code)}" disabled /><div class="field-hint">Nomor provisional</div></div>
          <div class="field"><label>Tanggal Transaksi <span class="required">*</span></label><input type="date" max="${localDateString(today)}" value="${esc(state.transactionDate)}" onchange="salesSetField('transactionDate', this.value)" /></div>
          <div class="field"><label>Dibuat pada</label><input class="disabled" value="${esc(state.createdAt)}" disabled /></div>
          <div class="field"><label>Dibuat oleh</label><input class="disabled" value="Owner • Siti Mulyani" disabled /></div>
        </div>
        <div class="wizard-footer"><span></span><button class="btn btn-primary" onclick="salesNextStep()">Lanjut ke Pelanggan →</button></div>
      </div>`;
  }

  function customerResults() {
    const query = state.customerQuery.trim().toLowerCase();
    const results = customers.filter(item => !query || `${item.name} ${item.phone}`.toLowerCase().includes(query));
    return results.length ? results.map(item => `
      <button type="button" class="customer-result ${state.customerId === item.id ? "selected" : ""}" onclick="salesSelectCustomer('${item.id}')">
        <span class="customer-avatar">${item.name.split(" ").slice(0, 2).map(word => word[0]).join("")}</span>
        <span><strong>${esc(item.name)}</strong><small>${esc(item.phone)} • ${esc(item.address)}</small></span>
        <span class="result-check">${state.customerId === item.id ? "✓" : ""}</span>
      </button>`).join("") : `<div class="empty-result">Pelanggan tidak ditemukan. Tambahkan sebagai pelanggan baru.</div>`;
  }

  function stepCustomer() {
    const customer = selectedCustomer();
    return `
      <div class="card panel wizard-card">
        <div class="wizard-section-title"><span>2</span><div><h2>Informasi Pelanggan</h2><p>Cari berdasarkan nama atau nomor telepon, atau tambahkan pelanggan baru.</p></div></div>
        <div class="customer-toolbar">
          <div class="search-box"><span>⌕</span><input id="customerSearchInput" value="${esc(state.customerQuery)}" placeholder="Cari nama atau nomor telepon..." oninput="salesSearchCustomer(this.value)" /></div>
          <button class="btn btn-soft" onclick="salesOpenCustomerModal()">＋ Tambah Pelanggan</button>
        </div>
        <div class="customer-layout">
          <div class="customer-results" id="customerResults">${customerResults()}</div>
          <aside class="selected-customer-card ${customer ? "has-data" : ""}">
            ${customer ? `
              <div class="selected-label">PELANGGAN TERPILIH</div>
              <h3>${esc(customer.name)}</h3>
              <dl><div><dt>Nomor telepon</dt><dd>${esc(customer.phone)}</dd></div><div><dt>Email</dt><dd>${esc(customer.email || "-")}</dd></div><div><dt>Alamat</dt><dd>${esc(customer.address)}</dd></div><div><dt>Rekening</dt><dd>${esc(customer.bankName ? `${customer.bankName} • ${customer.accountNumber}` : "Belum tersedia")}</dd></div></dl>
            ` : `<div class="customer-placeholder"><span>♙</span><strong>Belum ada pelanggan dipilih</strong><small>Pilih pelanggan dari daftar di sebelah kiri.</small></div>`}
          </aside>
        </div>
        <div class="wizard-footer"><button class="btn btn-ghost" onclick="salesPreviousStep()">← Kembali</button><button class="btn btn-primary" onclick="salesNextStep()">Lanjut ke Produk/Jasa →</button></div>
      </div>`;
  }

  function matchingCatalog() {
    const query = state.productQuery.trim().toLowerCase();
    return catalog.filter(item => {
      const haystack = `${item.name} ${item.type} ${item.barcode || ""} ${(item.variants || []).map(variant => `${variant.name} ${variant.barcode}`).join(" ")}`.toLowerCase();
      return item.sellable && (!query || haystack.includes(query));
    });
  }

  function catalogResults() {
    const matches = matchingCatalog();
    if (!matches.length) return `<div class="empty-result">Produk atau jasa tidak ditemukan.</div>`;
    return ["Produk", "Jasa"].map(type => {
      const items = matches.filter(item => item.type === type);
      if (!items.length) return "";
      return `<div class="catalog-group"><div class="catalog-group-title"><span class="type-badge ${type.toLowerCase()}">${type}</span><small>${items.length} pilihan</small></div>
        ${items.map(item => {
          if (item.variants && item.variants.length) {
            return `<div class="catalog-product"><div class="catalog-parent"><strong>${esc(item.name)}</strong><small>Pilih salah satu varian</small></div>
              <div class="variant-list">${item.variants.map(variant => `<button type="button" onclick="salesAddCatalogItem('${item.id}', '${variant.id}')"><span><strong>${esc(variant.name)}</strong><small>${esc(variant.unit)} • ${esc(variant.barcode)}</small></span><b>${money(variant.price)}</b><i>＋</i></button>`).join("")}</div>
            </div>`;
          }
          return `<button type="button" class="catalog-single" onclick="salesAddCatalogItem('${item.id}')"><span><strong>${esc(item.name)}</strong><small>${esc(item.unit)}${item.barcode ? ` • ${esc(item.barcode)}` : ""}</small></span><b>${money(item.price)}</b><i>＋</i></button>`;
        }).join("")}</div>`;
    }).join("");
  }

  function itemRows() {
    if (!state.items.length) return `<div class="empty-items"><span>▦</span><strong>Belum ada produk atau jasa</strong><small>Cari dan pilih item di atas untuk memasukkannya ke nota.</small></div>`;
    return state.items.map((item, index) => {
      const gross = Math.max(item.qty, 0) * item.price;
      const disc = discountAmount(gross, item.discountType, item.discountValue);
      const itemTaxDisabled = state.transactionTax !== "none";
      return `<article class="sales-line-card">
        <div class="line-index">${index + 1}</div>
        <div class="line-main">
          <div class="line-title"><span class="type-badge ${item.type.toLowerCase()}">${item.type}</span><div><strong>${esc(item.product)}</strong>${item.variant ? `<small>${esc(item.variant)}</small>` : ""}</div></div>
          <div class="line-fields">
            <div class="field compact"><label>Jumlah</label><div class="qty-unit"><input type="number" min="0.01" step="0.01" value="${item.qty}" oninput="salesUpdateItem('${item.id}', 'qty', this.value)" /><span>${esc(item.unit)}</span></div></div>
            <div class="field compact"><label>Harga master</label><input class="disabled" value="${money(item.price)}" disabled /></div>
            <div class="field compact discount-field"><label>Diskon item</label><div><select onchange="salesSetItemDiscountType('${item.id}', this.value)"><option value="percent" ${item.discountType === "percent" ? "selected" : ""}>%</option><option value="nominal" ${item.discountType === "nominal" ? "selected" : ""}>Rp</option></select>${item.discountType === "nominal" ? `<input type="text" inputmode="numeric" value="${numberLabel(item.discountValue)}" oninput="salesItemMoneyInput('${item.id}', 'discountValue', this)" />` : `<input type="number" min="0" max="100" value="${item.discountValue}" oninput="salesUpdateItem('${item.id}', 'discountValue', this.value)" />`}</div></div>
            <div class="field compact"><label>Pajak item</label><select ${itemTaxDisabled ? "disabled class=\"disabled\"" : ""} onchange="salesSetItemTax('${item.id}', this.value)"><option value="none" ${item.taxType === "none" ? "selected" : ""}>Tanpa Pajak</option><option value="ppn" ${item.taxType === "ppn" ? "selected" : ""}>PPN 11%</option><option value="pph" ${item.taxType === "pph" ? "selected" : ""}>PPh 10%</option></select></div>
          </div>
          <div class="field compact line-note"><label>Catatan item</label><input value="${esc(item.note)}" placeholder="Catatan khusus untuk item ini..." oninput="salesUpdateItem('${item.id}', 'note', this.value)" /></div>
        </div>
        <div class="line-total"><small>Total sebelum pajak</small><strong>${money(gross - disc)}</strong><button title="Hapus item" onclick="salesRemoveItem('${item.id}')">×</button></div>
      </article>`;
    }).join("");
  }

  function summaryCard() {
    const calc = calculation();
    return `<aside class="sales-summary-card">
      <h3>Ringkasan Transaksi</h3>
      <div class="summary-row"><span>Subtotal</span><strong id="salesSubtotal">${money(calc.subtotal)}</strong></div>
      <div class="summary-row"><span>Diskon item</span><strong id="salesItemDiscount">− ${money(calc.itemDiscount)}</strong></div>
      <div class="summary-control"><label>Diskon transaksi</label><div><select onchange="salesSetField('transactionDiscountType', this.value, true)"><option value="percent" ${state.transactionDiscountType === "percent" ? "selected" : ""}>Persentase (%)</option><option value="nominal" ${state.transactionDiscountType === "nominal" ? "selected" : ""}>Nominal (Rp)</option></select>${state.transactionDiscountType === "nominal" ? rupiahInput(state.transactionDiscountValue, `oninput="salesMoneyInput('transactionDiscountValue', this); salesRefreshCalculation()"`) : `<div class="percent-input"><input type="number" min="0" max="100" value="${state.transactionDiscountValue}" oninput="salesSetField('transactionDiscountValue', this.value); salesRefreshCalculation()" /><span>%</span></div>`}</div><small id="salesTransactionDiscount">− ${money(calc.transactionDiscount)}</small></div>
      <div class="summary-control"><label>Pajak transaksi</label><select onchange="salesSetTransactionTax(this.value)"><option value="none" ${state.transactionTax === "none" ? "selected" : ""}>Gunakan pajak per item</option><option value="ppn" ${state.transactionTax === "ppn" ? "selected" : ""}>PPN 11%</option><option value="pph" ${state.transactionTax === "pph" ? "selected" : ""}>PPh 10%</option></select><small id="salesTax">${calc.tax >= 0 ? "+" : "−"} ${money(Math.abs(calc.tax))}</small></div>
      <div class="summary-control"><label>Biaya Tambahan</label>${rupiahInput(state.fee, `oninput="salesMoneyInput('fee', this); salesRefreshCalculation()"`)}</div>
      <div class="summary-grand"><span>Total Transaksi</span><strong id="salesGrandTotal">${money(calc.total)}</strong></div>
      <p>Diskon item diterapkan lebih dulu, kemudian diskon transaksi, pajak, dan biaya tambahan.</p>
    </aside>`;
  }

  function stepItems() {
    return `
      <div class="wizard-columns">
        <div class="card panel wizard-card item-workspace">
          <div class="wizard-section-title"><span>3</span><div><h2>Produk atau Jasa</h2><p>Harga dan satuan mengikuti master data dan tidak dapat diubah.</p></div></div>
          <div class="catalog-search"><div class="search-box"><span>⌕</span><input id="productSearchInput" value="${esc(state.productQuery)}" placeholder="Ketik nama, varian, atau scan barcode..." oninput="salesSearchProduct(this.value)" onkeydown="salesProductKey(event)" /></div><button class="btn btn-soft" onclick="salesFocusBarcode()">▣ Scan Barcode</button></div>
          <div class="catalog-results ${state.productQuery ? "show" : ""}" id="catalogResults">${catalogResults()}</div>
          <div class="selected-items-head"><div><h3>Daftar Produk dan Jasa di Nota</h3><small>${state.items.length} baris item</small></div></div>
          <div id="salesItemRows">${itemRows()}</div>
          <div class="transaction-extras">
            <div class="field"><label>Catatan Transaksi</label><textarea placeholder="Catatan untuk pelanggan atau tim internal..." oninput="salesSetField('note', this.value)">${esc(state.note)}</textarea></div>
            <div class="field"><label>Lampiran</label><label class="upload sales-upload"><input type="file" multiple onchange="salesHandleAttachments(this.files)" /><span>📎 Klik untuk memilih file atau seret ke area ini</span><small>Maksimal 3 file • JPG, PNG, PDF, DOC, XLS, CSV</small></label><div class="attachment-list">${state.attachments.map(name => `<span>${esc(name)} ✓</span>`).join("")}</div></div>
          </div>
          <div class="wizard-footer"><button class="btn btn-ghost" onclick="salesPreviousStep()">← Kembali</button><div><button class="btn btn-ghost" onclick="salesSaveDraft()">Simpan Draft</button><button class="btn btn-primary" onclick="salesNextStep()">Lanjut ke Pembayaran →</button></div></div>
        </div>
        ${summaryCard()}
      </div>`;
  }

  function paymentFields(calc) {
    if (state.paymentType === "later") {
      return `<div class="payment-later-note"><span>◷</span><div><strong>Tidak ada pembayaran awal</strong><p>Sisa tagihan akan sama dengan total transaksi dan status menjadi Belum Dibayar.</p></div></div>
        <div class="form-grid wizard-form-grid"><div class="field"><label>Tanggal Jatuh Tempo <span class="required">*</span></label><input type="date" min="${state.transactionDate}" value="${state.dueDate}" onchange="salesSetField('dueDate', this.value)" /></div></div>`;
    }
    const paymentAmount = state.paymentType === "full" ? calc.total : Number(state.paymentAmount) || 0;
    const customer = selectedCustomer();
    const receiver = receiverAccounts.find(account => account.id === state.receiverAccount) || receiverAccounts[0];
    return `
      <div class="payment-method-title">Metode Pembayaran</div>
      <div class="payment-choice compact-choice">
        <button class="${state.paymentMethod === "cash" ? "selected" : ""}" onclick="salesSetPaymentMethod('cash')"><span>💵</span><strong>Tunai</strong><small>Diterima melalui kas</small></button>
        <button class="${state.paymentMethod === "transfer" ? "selected" : ""}" onclick="salesSetPaymentMethod('transfer')"><span>⇄</span><strong>Transfer</strong><small>Diterima melalui bank</small></button>
      </div>
      <div class="form-grid wizard-form-grid payment-form">
        <div class="field"><label>Nominal Pembayaran <span class="required">*</span></label>${rupiahInput(paymentAmount, state.paymentType === "full" ? `disabled class="disabled"` : `oninput="salesMoneyInput('paymentAmount', this); salesRefreshPaymentSummary()"`)}</div>
        <div class="field"><label>Tanggal Pembayaran <span class="required">*</span></label><input type="date" value="${state.paymentDate}" onchange="salesSetField('paymentDate', this.value)" /></div>
        ${state.paymentType === "partial" ? `<div class="field"><label>Tanggal Jatuh Tempo <span class="required">*</span></label><input type="date" min="${state.transactionDate}" value="${state.dueDate}" onchange="salesSetField('dueDate', this.value)" /></div>` : ""}
        ${state.paymentMethod === "cash" ? `
          <div class="field"><label>Kas Penerima <span class="required">*</span></label><select onchange="salesSetField('cashAccount', this.value)"><option>Kas Utama</option><option>Kas Toko Retail</option><option>Kas Roastery</option></select></div>
          <div class="field"><label>Uang Diterima <span class="required">*</span></label>${rupiahInput(state.cashReceived, `oninput="salesMoneyInput('cashReceived', this); salesRefreshPaymentSummary()"`)}<button type="button" class="exact-money-btn" onclick="salesUseExactCash()">✓ Gunakan Uang Pas (${money(paymentAmount)})</button></div>
          <div class="field"><label>Uang Kembali</label><input id="salesChangeAmount" class="disabled" value="${money(Math.max((Number(state.cashReceived) || 0) - paymentAmount, 0))}" disabled /></div>
        ` : `
          <div class="payment-subsection full"><div><strong>Data Rekening Penerima</strong><small>Rekening aktif milik ${esc(state.source)}</small></div></div>
          <div class="field"><label>Rekening Penerima <span class="required">*</span></label><select onchange="salesSetReceiverAccount(this.value)">${receiverAccounts.map(account => `<option value="${account.id}" ${state.receiverAccount === account.id ? "selected" : ""}>${esc(account.label)} • ${esc(account.number)}</option>`).join("")}</select></div>
          <div class="field"><label>Nama Pemilik Rekening Penerima</label><input class="disabled" value="${esc(receiver.owner)}" disabled /><div class="field-hint">Otomatis mengikuti Rekening Penerima</div></div>
          <div class="payment-subsection full"><div><strong>Data Rekening Pengirim</strong><small>Rekening milik pelanggan yang melakukan pembayaran</small></div></div>
          <div class="field"><label>Nama Bank Pengirim <span class="required">*</span></label><input value="${esc(state.senderBankName || customer?.bankName || "")}" oninput="salesSetField('senderBankName', this.value)" placeholder="Contoh: Bank BCA" /></div>
          <div class="field"><label>Nama Pemilik Rekening Pengirim <span class="required">*</span></label><input value="${esc(state.senderAccountHolder || customer?.accountHolder || "")}" oninput="salesSetField('senderAccountHolder', this.value)" /></div>
          <div class="field"><label>Nomor Rekening Pengirim <span class="required">*</span></label><input value="${esc(state.senderAccountNumber || customer?.accountNumber || "")}" oninput="salesSetField('senderAccountNumber', this.value)" /></div>
          <label class="check-option full sender-save-option"><input type="checkbox" ${state.saveSenderAccount ? "checked" : ""} onchange="salesSetField('saveSenderAccount', this.checked)" /> <span><strong>Simpan rekening ini ke data pelanggan</strong><small>Informasi rekening pengirim dapat digunakan pada transaksi berikutnya.</small></span></label>
        `}
        <div class="field"><label>Bukti Pembayaran <span class="optional">Opsional</span></label><input type="file" onchange="salesSetEvidence(this.files)" /><div class="field-hint">${esc(state.paymentEvidence || "Belum ada file dipilih")}</div></div>
      </div>`;
  }

  function stepPayment() {
    const calc = calculation();
    return `
      <div class="wizard-columns payment-layout">
        <div class="card panel wizard-card">
          <div class="wizard-section-title"><span>4</span><div><h2>Informasi Pembayaran</h2><p>Catat pembayaran pertama atau terbitkan transaksi untuk dibayar nanti.</p></div></div>
          <div class="payment-choice">
            <button class="${state.paymentType === "full" ? "selected" : ""}" onclick="salesSetPaymentType('full')"><span>✓</span><strong>Lunas Saat Ini</strong><small>Bayar seluruh total transaksi</small></button>
            <button class="${state.paymentType === "partial" ? "selected" : ""}" onclick="salesSetPaymentType('partial')"><span>◒</span><strong>Dibayar Sebagian / DP</strong><small>Catat pembayaran awal</small></button>
            <button class="${state.paymentType === "later" ? "selected" : ""}" onclick="salesSetPaymentType('later')"><span>◷</span><strong>Bayar Nanti</strong><small>Terbitkan sebagai piutang</small></button>
          </div>
          <div class="payment-fields">${paymentFields(calc)}</div>
          <div class="wizard-footer"><button class="btn btn-ghost" onclick="salesPreviousStep()">← Kembali</button><button class="btn btn-primary" onclick="salesNextStep()">Preview Transaksi →</button></div>
        </div>
        <aside class="sales-summary-card payment-summary">
          <h3>Ringkasan Pembayaran</h3>
          <div class="summary-row"><span>Total Transaksi</span><strong>${money(calc.total)}</strong></div>
          <div class="summary-row"><span>Total Pembayaran</span><strong id="salesPaymentTotal">${money(paymentTotal(calc))}</strong></div>
          <div class="summary-grand"><span>Sisa Tagihan</span><strong id="salesPaymentRemaining">${money(Math.max(calc.total - paymentTotal(calc), 0))}</strong></div>
          <div class="status-preview"><small>Status pembayaran</small><span id="salesPaymentStatus" class="badge ${paymentStatusClass(calc)}">${paymentStatusLabel(calc)}</span></div>
          <p>Status dihitung otomatis dan tidak dapat dipilih manual.</p>
        </aside>
      </div>`;
  }

  function paymentTotal(calc) {
    if (state.paymentType === "later") return 0;
    if (state.paymentType === "full") return calc.total;
    return Math.min(Math.max(Number(state.paymentAmount) || 0, 0), calc.total);
  }

  function paymentStatusLabel(calc) {
    const paid = paymentTotal(calc);
    if (paid <= 0) return "Belum Dibayar";
    if (paid >= calc.total) return "Lunas";
    return "Dibayar Sebagian";
  }

  function paymentStatusClass(calc) {
    const label = paymentStatusLabel(calc);
    return label === "Lunas" ? "paid" : label === "Dibayar Sebagian" ? "partial" : "unpaid";
  }

  function previewItems() {
    return state.items.map((item, index) => {
      const gross = item.qty * item.price;
      const disc = discountAmount(gross, item.discountType, item.discountValue);
      const taxLabel = item.taxType === "ppn" ? "PPN 11%" : item.taxType === "pph" ? "PPh 10%" : "Tanpa pajak";
      return `<tr><td>${index + 1}</td><td><strong>${esc(item.product)}</strong>${item.variant ? `<small>${esc(item.variant)}</small>` : ""}<em>${esc(item.type)}</em></td><td>${item.qty} ${esc(item.unit)}</td><td>${money(item.price)}</td><td>${disc ? `− ${money(disc)}` : "-"}</td><td>${taxLabel}</td><td class="amount">${money(gross - disc)}</td></tr>`;
    }).join("");
  }

  function stepPreview() {
    const calc = calculation();
    const customer = selectedCustomer();
    const paid = paymentTotal(calc);
    const paymentTypeLabel = state.paymentType === "full" ? "Lunas Saat Ini" : state.paymentType === "partial" ? "Dibayar Sebagian / DP" : "Bayar Nanti";
    return `
      <div class="card panel wizard-card preview-card">
        <div class="preview-header"><div><div class="eyebrow">PREVIEW TRANSAKSI</div><h2>Periksa sebelum menyimpan</h2><p>Transaksi belum terbentuk sampai Anda menekan tombol Simpan.</p></div><span class="preview-status">Siap diterbitkan</span></div>
        <section class="preview-section"><div class="preview-section-head"><h3>Informasi Nota</h3><button onclick="salesJumpStep(1)">Ubah</button></div><div class="preview-grid"><div><small>Sumber data</small><strong>${esc(state.source)}</strong></div><div><small>No. Nota</small><strong>${esc(state.code)} <em>Provisional</em></strong></div><div><small>Tanggal transaksi</small><strong>${esc(state.transactionDate)}</strong></div><div><small>Dibuat oleh</small><strong>Siti Mulyani</strong></div></div></section>
        <section class="preview-section"><div class="preview-section-head"><h3>Informasi Pelanggan</h3><button onclick="salesJumpStep(2)">Ubah</button></div><div class="customer-preview"><span class="customer-avatar">${customer.name.split(" ").slice(0, 2).map(word => word[0]).join("")}</span><div><strong>${esc(customer.name)}</strong><small>${esc(customer.phone)} • ${esc(customer.email || "Tanpa email")}</small><p>${esc(customer.address)}</p></div></div></section>
        <section class="preview-section"><div class="preview-section-head"><h3>Produk atau Jasa</h3><button onclick="salesJumpStep(3)">Ubah</button></div><div class="table-wrap preview-table"><table><thead><tr><th>No.</th><th>Item</th><th>Jumlah</th><th>Harga</th><th>Diskon</th><th>Pajak</th><th>Total</th></tr></thead><tbody>${previewItems()}</tbody></table></div></section>
        <div class="preview-bottom">
          <section class="preview-section payment-preview"><div class="preview-section-head"><h3>Pembayaran</h3><button onclick="salesJumpStep(4)">Ubah</button></div><dl><div><dt>Jenis pembayaran</dt><dd>${paymentTypeLabel}</dd></div>${state.paymentType !== "later" ? `<div><dt>Metode</dt><dd>${state.paymentMethod === "cash" ? "Tunai" : "Transfer"}</dd></div><div><dt>Tanggal pembayaran</dt><dd>${esc(state.paymentDate)}</dd></div>` : ""}${state.dueDate ? `<div><dt>Jatuh tempo</dt><dd>${esc(state.dueDate)}</dd></div>` : ""}<div><dt>Status pembayaran</dt><dd><span class="badge ${paymentStatusClass(calc)}">${paymentStatusLabel(calc)}</span></dd></div></dl></section>
          <section class="preview-total"><div><span>Subtotal</span><strong>${money(calc.subtotal)}</strong></div><div><span>Total Diskon</span><strong>− ${money(calc.totalDiscount)}</strong></div><div><span>Total Pajak</span><strong>${calc.tax >= 0 ? "+" : "−"} ${money(Math.abs(calc.tax))}</strong></div><div><span>Biaya Tambahan</span><strong>+ ${money(calc.fee)}</strong></div><div class="grand"><span>Total Transaksi</span><strong>${money(calc.total)}</strong></div><div><span>Total Pembayaran</span><strong>${money(paid)}</strong></div><div class="remaining"><span>Sisa Tagihan</span><strong>${money(Math.max(calc.total - paid, 0))}</strong></div></section>
        </div>
        <div class="wizard-footer"><button class="btn btn-ghost" onclick="salesPreviousStep()">← Kembali</button><div><button class="btn btn-primary" onclick="salesAskPublish(false)">Simpan</button><button class="btn btn-green" onclick="salesAskPublish(true)">Simpan & Buat Transaksi Baru</button></div></div>
      </div>`;
  }

  function customerModal() {
    return `<div class="modal-backdrop" id="salesCustomerModal"><div class="modal customer-modal"><div class="modal-head"><div><div class="modal-title">Tambah Pelanggan</div><div class="sub-text">Pelanggan baru akan langsung dipilih pada transaksi.</div></div><button class="close" onclick="salesCloseCustomerModal()">×</button></div>
      <div class="form-grid wizard-form-grid">
        <div class="field"><label>Nama Pelanggan <span class="required">*</span></label><input id="newCustomerName" placeholder="Nama perusahaan atau pelanggan" /></div>
        <div class="field"><label>Nomor Telepon <span class="required">*</span></label><input id="newCustomerPhone" placeholder="08xx atau 021..." /></div>
        <div class="field"><label>Email</label><input id="newCustomerEmail" type="email" placeholder="nama@perusahaan.com" /></div>
        <div class="field full"><label>Alamat <span class="required">*</span></label><textarea id="newCustomerAddress" placeholder="Alamat lengkap pelanggan"></textarea></div>
      </div>
      <div class="modal-subsection"><h3>Informasi Rekening <span>Opsional</span></h3><div class="form-grid wizard-form-grid"><div class="field"><label>Nama Bank/Rekening</label><input id="newCustomerBank" placeholder="Contoh: Bank BCA" /></div><div class="field"><label>Nama Pemilik Rekening</label><input id="newCustomerHolder" /></div><div class="field"><label>Nomor Rekening</label><input id="newCustomerAccount" /></div></div></div>
      <div class="modal-actions"><button class="btn btn-ghost" onclick="salesCloseCustomerModal()">Batal</button><button class="btn btn-primary" onclick="salesSaveCustomer()">Simpan Pelanggan</button></div></div></div>`;
  }

  function publishModal() {
    const calc = calculation();
    return `<div class="modal-backdrop" id="salesPublishModal"><div class="modal publish-modal"><div class="publish-icon">✓</div><h2>Terbitkan transaksi penjualan?</h2><p>No. Nota <strong>${esc(state.code)}</strong> akan resmi digunakan dan transaksi tidak dapat dikembalikan menjadi Draft.</p><div class="publish-summary"><span>Total transaksi</span><strong>${money(calc.total)}</strong></div><div class="modal-actions"><button class="btn btn-ghost" onclick="salesClosePublishModal()">Periksa Lagi</button><button class="btn btn-primary" onclick="salesConfirmPublish()">Ya, Simpan Transaksi</button></div></div></div>`;
  }

  function renderWizard() {
    document.getElementById("salesWizard").innerHTML = wizardShell();
    document.getElementById("pageTitle").textContent = state.mode === "edit" ? "Ubah Penjualan" : "Tambah Penjualan";
    document.getElementById("pageBreadcrumb").textContent = `Tahap ${state.step} dari 5 • ${steps[state.step - 1]}`;
  }

  function validateStep(step) {
    if (step === 1) {
      if (!state.source || !state.code || !state.transactionDate) return "Informasi nota belum lengkap.";
      if (parseDate(state.transactionDate) > today) return "Tanggal transaksi tidak boleh berada di masa depan.";
    }
    if (step === 2 && !selectedCustomer()) return "Pilih pelanggan sebelum melanjutkan.";
    if (step === 3) {
      if (!state.items.length) return "Tambahkan minimal satu produk atau jasa.";
      if (state.items.some(item => Number(item.qty) <= 0)) return "Jumlah setiap item harus lebih besar dari nol.";
      if (calculation().total <= 0) return "Total transaksi harus lebih besar dari nol.";
    }
    if (step === 4) {
      const calc = calculation();
      if (state.paymentType === "later") {
        if (!state.dueDate) return "Tanggal jatuh tempo wajib diisi untuk Bayar Nanti.";
      } else {
        const paid = paymentTotal(calc);
        if (!state.paymentDate) return "Tanggal pembayaran wajib diisi.";
        if (state.paymentType === "partial" && (paid <= 0 || paid >= calc.total)) return "Nominal DP harus lebih dari nol dan lebih kecil dari total transaksi.";
        if (state.paymentMethod === "cash") {
          if (!state.cashAccount) return "Pilih Kas Penerima.";
          if ((Number(state.cashReceived) || 0) < paid) return "Uang diterima tidak boleh lebih kecil dari nominal pembayaran.";
        } else {
          const customer = selectedCustomer();
          const bank = state.senderBankName || customer?.bankName;
          const holder = state.senderAccountHolder || customer?.accountHolder;
          const account = state.senderAccountNumber || customer?.accountNumber;
          if (!state.receiverAccount || !bank || !holder || !account) return "Lengkapi rekening penerima dan rekening pengirim pelanggan.";
        }
      }
      if (state.dueDate && state.dueDate < state.transactionDate) return "Tanggal jatuh tempo tidak boleh lebih awal dari tanggal transaksi.";
    }
    return "";
  }

  function buildPayload(status) {
    const calc = calculation();
    const customer = selectedCustomer();
    const paid = status === "Draft" ? 0 : paymentTotal(calc);
    const hasPayment = paid > 0;
    if (status === "Terbit" && hasPayment && state.paymentMethod === "transfer" && state.saveSenderAccount) {
      customer.bankName = state.senderBankName || customer.bankName;
      customer.accountHolder = state.senderAccountHolder || customer.accountHolder;
      customer.accountNumber = state.senderAccountNumber || customer.accountNumber;
    }
    const receiver = receiverAccounts.find(account => account.id === state.receiverAccount) || receiverAccounts[0];
    const paymentAccount = state.paymentMethod === "cash" ? state.cashAccount : `${receiver.label} • ${receiver.number}`;
    const oldInvoice = invoices.find(item => item.id === selectedId);
    return {
      id: state.mode === "create" ? Date.now() : selectedId,
      code: state.code,
      vendor: customer.name,
      customer: { ...customer },
      vendorRef: "",
      date: state.transactionDate,
      dueDate: status === "Draft" || state.paymentType === "full" ? "" : state.dueDate,
      term: "custom",
      transactionStatus: status,
      sourceData: state.source,
      paymentMethod: hasPayment ? (state.paymentMethod === "cash" ? "Tunai" : "Transfer Bank") : "",
      cashBankAccount: hasPayment ? paymentAccount : "",
      creator: "Siti Mulyani",
      createdAt: oldInvoice?.createdAt || new Date().toISOString(),
      issuedAt: status === "Terbit" ? new Date().toISOString() : "",
      issuedBy: status === "Terbit" ? "Siti Mulyani" : "",
      transactionDiscountType: state.transactionDiscountType,
      transactionDiscountValue: Number(state.transactionDiscountValue) || 0,
      transactionTax: state.transactionTax,
      discount: calc.totalDiscount,
      tax: calc.tax,
      fee: calc.fee,
      paidAmount: paid,
      note: state.note,
      attachments: [...state.attachments],
      paymentType: status === "Draft" ? "" : state.paymentType,
      items: state.items.map(item => ({ ...item, desc: item.note || item.variant || "-" })),
      payments: hasPayment ? [{ date: state.paymentDate, amount: paid, account: paymentAccount, ref: state.paymentEvidence || "Pembayaran pertama", method: state.paymentMethod }] : [],
      changes: oldInvoice
        ? [...oldInvoice.changes, status === "Draft" ? "Draft diperbarui" : "Transaksi diterbitkan oleh Siti Mulyani"]
        : [status === "Draft" ? "Draft penjualan dibuat" : "Transaksi terbit dibuat oleh Siti Mulyani"]
    };
  }

  function persist(status, createAnother) {
    const payload = buildPayload(status);
    if (state.mode === "create") invoices.unshift(payload);
    else {
      const index = invoices.findIndex(item => item.id === selectedId);
      invoices[index] = payload;
    }
    selectedId = payload.id;
    activeTransactionTab = payload.transactionStatus;
    state.dirty = false;
    renderList();
    if (status === "Draft") {
      showToast("Draft penjualan berhasil disimpan.");
      showPage("detail");
      return;
    }
    if (createAnother) {
      showToast("Penjualan berhasil disimpan. Form baru telah disiapkan.");
      window.openForm("create");
    } else {
      showToast("Penjualan berhasil disimpan dan diterbitkan.");
      showPage("detail");
    }
  }

  window.openForm = function (type) {
    state = blankState(type);
    lineId = 1;
    renderWizard();
    showPage("form");
  };

  window.salesSetField = function (key, value, rerender) {
    state[key] = ["fee", "transactionDiscountValue", "paymentAmount", "cashReceived"].includes(key) ? Number(value) || 0 : value;
    setDirty();
    if (rerender) renderWizard();
  };

  window.salesMoneyInput = function (key, input) {
    state[key] = parseMoney(input.value);
    input.value = numberLabel(state[key]);
    setDirty();
  };

  window.salesNextStep = function () {
    const error = validateStep(state.step);
    if (error) return showToast(error);
    state.step = Math.min(state.step + 1, 5);
    renderWizard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.salesPreviousStep = function () {
    state.step = Math.max(state.step - 1, 1);
    renderWizard();
  };

  window.salesJumpStep = function (step) {
    if (step > state.step) return;
    state.step = step;
    renderWizard();
  };

  window.salesExitWizard = function () {
    if (state.dirty && !window.confirm("Data yang telah diisi akan hilang. Keluar dari Tambah Penjualan?")) return;
    state.dirty = false;
    showPage("list");
  };

  window.salesSearchCustomer = function (query) {
    state.customerQuery = query;
    document.getElementById("customerResults").innerHTML = customerResults();
  };

  window.salesSelectCustomer = function (id) {
    state.customerId = id;
    state.customerQuery = "";
    setDirty();
    renderWizard();
  };

  window.salesOpenCustomerModal = function () { document.getElementById("salesCustomerModal").classList.add("show"); };
  window.salesCloseCustomerModal = function () { document.getElementById("salesCustomerModal").classList.remove("show"); };

  window.salesSaveCustomer = function () {
    const name = document.getElementById("newCustomerName").value.trim();
    const phone = document.getElementById("newCustomerPhone").value.trim();
    const address = document.getElementById("newCustomerAddress").value.trim();
    if (!name || !phone || !address) return showToast("Nama, nomor telepon, dan alamat wajib diisi.");
    const customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      address,
      email: document.getElementById("newCustomerEmail").value.trim(),
      bankName: document.getElementById("newCustomerBank").value.trim(),
      accountHolder: document.getElementById("newCustomerHolder").value.trim(),
      accountNumber: document.getElementById("newCustomerAccount").value.trim()
    };
    customers.unshift(customer);
    state.customerId = customer.id;
    setDirty();
    showToast("Pelanggan baru berhasil ditambahkan dan dipilih.");
    renderWizard();
  };

  window.salesSearchProduct = function (query) {
    state.productQuery = query;
    const results = document.getElementById("catalogResults");
    results.innerHTML = catalogResults();
    results.classList.add("show");
  };

  window.salesProductKey = function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const first = matchingCatalog()[0];
    if (!first) return;
    const variant = first.variants && first.variants.length ? first.variants[0].id : null;
    window.salesAddCatalogItem(first.id, variant);
  };

  window.salesFocusBarcode = function () {
    const input = document.getElementById("productSearchInput");
    input.focus();
    input.placeholder = "Scan atau ketik nomor barcode, lalu tekan Enter...";
    showToast("Mode pemindaian barcode aktif (simulasi). Ketik barcode lalu tekan Enter.");
  };

  window.salesAddCatalogItem = function (catalogId, variantId) {
    const product = catalog.find(item => item.id === catalogId);
    if (!product) return;
    const variant = variantId ? product.variants.find(item => item.id === variantId) : null;
    state.items.push({
      id: `line-${lineId++}`,
      catalogId: product.id,
      type: product.type,
      product: product.name,
      variant: variant?.name || "",
      unit: variant?.unit || product.unit,
      qty: 1,
      price: variant?.price || product.price,
      discountType: "percent",
      discountValue: 0,
      taxType: "none",
      note: ""
    });
    state.productQuery = "";
    setDirty();
    renderWizard();
    showToast(`${product.name}${variant ? ` • ${variant.name}` : ""} ditambahkan.`);
  };

  window.salesUpdateItem = function (id, key, value) {
    const item = state.items.find(line => line.id === id);
    if (!item) return;
    item[key] = ["qty", "discountValue"].includes(key) ? Number(value) || 0 : value;
    setDirty();
    window.salesRefreshCalculation();
  };

  window.salesSetItemDiscountType = function (id, value) {
    const item = state.items.find(line => line.id === id);
    if (!item) return;
    item.discountType = value;
    item.discountValue = 0;
    setDirty();
    renderWizard();
  };

  window.salesItemMoneyInput = function (id, key, input) {
    const item = state.items.find(line => line.id === id);
    if (!item) return;
    item[key] = parseMoney(input.value);
    input.value = numberLabel(item[key]);
    setDirty();
    window.salesRefreshCalculation();
  };

  window.salesSetItemTax = function (id, value) {
    const item = state.items.find(line => line.id === id);
    if (!item) return;
    if (state.transactionTax !== "none") state.transactionTax = "none";
    item.taxType = value;
    setDirty();
    renderWizard();
  };

  window.salesSetTransactionTax = function (value) {
    state.transactionTax = value;
    if (value !== "none") state.items.forEach(item => { item.taxType = "none"; });
    setDirty();
    renderWizard();
  };

  window.salesRemoveItem = function (id) {
    state.items = state.items.filter(item => item.id !== id);
    setDirty();
    renderWizard();
  };

  window.salesRefreshCalculation = function () {
    const calc = calculation();
    const pairs = {
      salesSubtotal: money(calc.subtotal),
      salesItemDiscount: `− ${money(calc.itemDiscount)}`,
      salesTransactionDiscount: `− ${money(calc.transactionDiscount)}`,
      salesTax: `${calc.tax >= 0 ? "+" : "−"} ${money(Math.abs(calc.tax))}`,
      salesGrandTotal: money(calc.total)
    };
    Object.entries(pairs).forEach(([id, value]) => { const el = document.getElementById(id); if (el) el.textContent = value; });
    document.querySelectorAll(".sales-line-card").forEach((row, index) => {
      const item = state.items[index];
      if (!item) return;
      const gross = item.qty * item.price;
      const total = gross - discountAmount(gross, item.discountType, item.discountValue);
      const target = row.querySelector(".line-total strong");
      if (target) target.textContent = money(total);
    });
  };

  window.salesHandleAttachments = function (files) {
    state.attachments = [...files].slice(0, 3).map(file => file.name);
    setDirty();
    renderWizard();
    if (files.length > 3) showToast("Maksimal tiga lampiran. Hanya tiga file pertama yang dipilih.");
  };

  window.salesSetPaymentType = function (type) {
    state.paymentType = type;
    if (type === "full") state.dueDate = "";
    if (type === "partial" && !state.paymentAmount) state.paymentAmount = Math.round(calculation().total * 0.3);
    setDirty();
    renderWizard();
  };

  window.salesSetPaymentMethod = function (method) {
    state.paymentMethod = method;
    const calc = calculation();
    if (method === "cash" && !state.cashReceived) state.cashReceived = paymentTotal(calc);
    setDirty();
    renderWizard();
  };

  window.salesUseExactCash = function () {
    state.cashReceived = paymentTotal(calculation());
    setDirty();
    renderWizard();
  };

  window.salesSetReceiverAccount = function (accountId) {
    state.receiverAccount = accountId;
    setDirty();
    renderWizard();
  };

  window.salesRefreshPaymentSummary = function () {
    const calc = calculation();
    const paid = paymentTotal(calc);
    const remaining = Math.max(calc.total - paid, 0);
    const totalEl = document.getElementById("salesPaymentTotal");
    const remainingEl = document.getElementById("salesPaymentRemaining");
    const statusEl = document.getElementById("salesPaymentStatus");
    const changeEl = document.getElementById("salesChangeAmount");
    if (totalEl) totalEl.textContent = money(paid);
    if (remainingEl) remainingEl.textContent = money(remaining);
    if (statusEl) { statusEl.textContent = paymentStatusLabel(calc); statusEl.className = `badge ${paymentStatusClass(calc)}`; }
    if (changeEl) changeEl.value = money(Math.max((Number(state.cashReceived) || 0) - paid, 0));
  };

  window.salesSetEvidence = function (files) { state.paymentEvidence = files[0]?.name || ""; setDirty(); renderWizard(); };

  window.salesSaveDraft = function () {
    for (let step = 1; step <= 3; step++) {
      const error = validateStep(step);
      if (error) return showToast(error);
    }
    persist("Draft", false);
  };

  window.salesAskPublish = function (createAnother) {
    const error = validateStep(4);
    if (error) return showToast(error);
    publishCreateAnother = createAnother;
    document.getElementById("salesPublishModal").classList.add("show");
  };

  window.salesClosePublishModal = function () { document.getElementById("salesPublishModal").classList.remove("show"); };
  window.salesConfirmPublish = function () { document.getElementById("salesPublishModal").classList.remove("show"); persist("Terbit", publishCreateAnother); };

  window.addEventListener("beforeunload", function (event) {
    if (!state || !state.dirty || !document.getElementById("formPage")?.classList.contains("active")) return;
    event.preventDefault();
    event.returnValue = "";
  });
})();
