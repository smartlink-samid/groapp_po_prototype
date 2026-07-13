const today = new Date("2026-07-13T00:00:00");
    const closedBookCutoffDate = "2026-07-01";
    const defaultPeriodStart = "2026-06-01";
    const defaultPeriodEnd = "2026-07-31";
    let mode = "create";
    let selectedId = null;
    let itemCounter = 0;
    let activeTransactionTab = "all";
    let selectedIds = new Set();
    let periodTarget = "quick";
    let periodDraft = { startDate: defaultPeriodStart, endDate: defaultPeriodEnd };
    let exportScope = "filtered";
    let exportFormat = "excel";
    let exportSelectedIds = null;
    let copySourceAfterVoid = null;
    let createSourceTemplate = null;

    const vendors = {
      "PT Maju Mapan": { phone: "021-5566-8800", email: "finance@majumapan.co.id" },
      "CV Sumber Rezeki": { phone: "031-7788-1200", email: "admin@sumberrezeki.id" },
      "PT Bahan Kopi Nusantara": { phone: "022-6677-9090", email: "order@bahankopi.id" },
      "UD Sinar Jaya": { phone: "0274-778-334", email: "sales@sinarjaya.id" },
      "PT Kemasan Prima": { phone: "021-8899-7722", email: "support@kemasanprima.id" },
      "Koperasi Tani Flores": { phone: "0380-221-908", email: "kopi@taniflores.id" }
    };

    let filters = {
      sources: [],
      vendors: [],
      startDate: defaultPeriodStart,
      endDate: defaultPeriodEnd,
      paymentMethod: "all",
      accounts: [],
      products: [],
      paymentStatus: "all",
      transactionStatus: "all",
      dueStatus: "all",
      creators: [],
      sortKey: "dueDate",
      sortDir: "asc"
    };

    let invoices = [
      {
        id: 1,
        code: "PUR-2026-0001",
        vendor: "PT Maju Mapan",
        vendorRef: "INV/VDR/001",
        date: "2026-07-03",
        dueDate: "2026-07-27",
        term: "30",
        transactionStatus: "Terbit",
        sourceData: "Perusahaan Kopi Nusantara",
        paymentMethod: "Transfer Bank",
        cashBankAccount: "BCA Operasional",
        creator: "Siti Mulyani",
        discount: 0,
        tax: 264000,
        fee: 0,
        paidAmount: 0,
        note: "",
        items: [
          { product: "Biji Kopi Arabika", desc: "Grade A, 25 kg", qty: 2, price: 1200000 }
        ],
        payments: [],
        changes: ["Transaksi terbit dibuat oleh Siti Mulyani"]
      },
      {
        id: 2,
        code: "PUR-2026-0002",
        vendor: "CV Sumber Rezeki",
        vendorRef: "SR-887",
        date: "2026-07-04",
        dueDate: "2026-07-20",
        term: "14",
        transactionStatus: "Terbit",
        sourceData: "Unit Retail",
        paymentMethod: "Transfer Bank",
        cashBankAccount: "Mandiri Bisnis",
        creator: "Raka Pratama",
        discount: 250000,
        tax: 550000,
        fee: 100000,
        paidAmount: 3000000,
        note: "",
        items: [
          { product: "Gula Aren Cair", desc: "Botol 1 liter", qty: 40, price: 110000 },
          { product: "Susu Barista", desc: "Dus 12 pcs", qty: 15, price: 180000 }
        ],
        payments: [
          { date: "2026-07-07", amount: 3000000, account: "Mandiri Bisnis", ref: "TRX-001" }
        ],
        changes: ["Transaksi terbit dibuat oleh Raka Pratama", "Pembayaran sebagian dicatat"]
      },
      {
        id: 3,
        code: "PUR-2026-0003",
        vendor: "PT Bahan Kopi Nusantara",
        vendorRef: "BKN-2026-91",
        date: "2026-07-01",
        dueDate: "2026-07-10",
        term: "custom",
        transactionStatus: "Terbit",
        sourceData: "Unit Roastery",
        paymentMethod: "Virtual Account",
        cashBankAccount: "BRI Utama",
        creator: "Siti Mulyani",
        discount: 0,
        tax: 0,
        fee: 0,
        paidAmount: 0,
        note: "",
        items: [
          { product: "Green Bean Robusta", desc: "Karung 50 kg", qty: 4, price: 2500000 }
        ],
        payments: [],
        changes: ["Transaksi terbit dibuat oleh Siti Mulyani"]
      },
      {
        id: 4,
        code: "PUR-2026-0004",
        vendor: "UD Sinar Jaya",
        vendorRef: "SJ-120",
        date: "2026-07-03",
        dueDate: "2026-07-13",
        term: "7",
        transactionStatus: "Terbit",
        sourceData: "Unit Retail",
        paymentMethod: "Tunai",
        cashBankAccount: "Kas Utama",
        creator: "Nadia Putri",
        discount: 0,
        tax: 0,
        fee: 0,
        paidAmount: 4200000,
        note: "",
        items: [
          { product: "Cup Paper 12oz", desc: "Isi 2000 pcs", qty: 2000, price: 2100 }
        ],
        payments: [
          { date: "2026-07-03", amount: 4200000, account: "Kas Utama", ref: "TRX-002" }
        ],
        changes: ["Transaksi terbit dibuat oleh Nadia Putri", "Tagihan lunas"]
      },
      {
        id: 5,
        code: "PUR-2026-0005",
        vendor: "PT Kemasan Prima",
        vendorRef: "",
        date: "2026-07-11",
        dueDate: "2026-07-16",
        term: "30",
        transactionStatus: "Draft",
        sourceData: "Perusahaan Kopi Nusantara",
        paymentMethod: "Transfer Bank",
        cashBankAccount: "BCA Operasional",
        creator: "Siti Mulyani",
        discount: 0,
        tax: 0,
        fee: 0,
        paidAmount: 0,
        note: "",
        items: [
          { product: "Label Produk", desc: "Sticker roll", qty: 3000, price: 1200 }
        ],
        payments: [],
        changes: ["Draft pembelian dibuat"]
      },
      {
        id: 6,
        code: "PUR-2026-0006",
        vendor: "Koperasi Tani Flores",
        vendorRef: "KTF-772",
        date: "2026-07-08",
        dueDate: "2026-07-14",
        term: "custom",
        transactionStatus: "Terbit",
        sourceData: "Unit Roastery",
        paymentMethod: "Transfer Bank",
        cashBankAccount: "BCA Operasional",
        creator: "Raka Pratama",
        discount: 150000,
        tax: 0,
        fee: 0,
        paidAmount: 0,
        note: "",
        items: [
          { product: "Green Bean Arabika", desc: "Flores, karung 60 kg", qty: 3, price: 3300000 }
        ],
        payments: [],
        changes: ["Transaksi terbit dibuat oleh Raka Pratama"]
      },
      {
        id: 7,
        code: "PUR-2026-0007",
        vendor: "PT Kemasan Prima",
        vendorRef: "KP-1109",
        date: "2026-07-06",
        dueDate: "2026-07-08",
        term: "custom",
        transactionStatus: "Void",
        sourceData: "Perusahaan Kopi Nusantara",
        paymentMethod: "Kartu Kredit",
        cashBankAccount: "Mandiri Bisnis",
        creator: "Nadia Putri",
        discount: 0,
        tax: 120000,
        fee: 0,
        paidAmount: 0,
        note: "Harga dari vendor berubah, dibuat salinan baru.",
        voidReason: "Harga dari vendor berubah, transaksi perlu dibuat ulang.",
        voidedAt: "2026-07-06",
        voidedBy: "Nadia Putri",
        voidBookStatus: "open",
        items: [
          { product: "Cup Sleeve", desc: "Karton 1000 pcs", qty: 4, price: 950000 }
        ],
        payments: [],
        changes: ["Transaksi terbit dibuat oleh Nadia Putri", "Transaksi di-void"]
      },
      {
        id: 8,
        code: "PUR-2026-0008",
        vendor: "PT Maju Mapan",
        vendorRef: "INV/VDR/044",
        date: "2026-06-27",
        dueDate: "2026-07-03",
        term: "7",
        transactionStatus: "Draft",
        sourceData: "Unit Retail",
        paymentMethod: "Transfer Bank",
        cashBankAccount: "BCA Operasional",
        creator: "Raka Pratama",
        discount: 80000,
        tax: 0,
        fee: 0,
        paidAmount: 0,
        note: "",
        items: [
          { product: "Susu Barista", desc: "Dus 12 pcs", qty: 6, price: 180000 }
        ],
        payments: [],
        changes: ["Draft pembelian dibuat"]
      },
      {
        id: 9,
        code: "PUR-2026-0009",
        vendor: "CV Sumber Rezeki",
        vendorRef: "SR-771",
        date: "2026-06-18",
        dueDate: "2026-07-02",
        term: "14",
        transactionStatus: "Terbit",
        sourceData: "Unit Retail",
        paymentMethod: "Transfer Bank",
        cashBankAccount: "Mandiri Bisnis",
        creator: "Nadia Putri",
        discount: 0,
        tax: 180000,
        fee: 0,
        paidAmount: 0,
        note: "Contoh transaksi sebelum tutup buku.",
        items: [
          { product: "Sirup Vanilla", desc: "Botol 750 ml", qty: 24, price: 95000 }
        ],
        payments: [],
        changes: ["Transaksi terbit dibuat sebelum tutup buku"]
      },
      {
        id: 10,
        code: "PUR-2026-0010",
        vendor: "PT Bahan Kopi Nusantara",
        vendorRef: "BKN-2026-74",
        date: "2026-06-24",
        dueDate: "2026-07-08",
        term: "14",
        transactionStatus: "Terbit",
        sourceData: "Unit Roastery",
        paymentMethod: "Virtual Account",
        cashBankAccount: "BRI Utama",
        creator: "Raka Pratama",
        discount: 200000,
        tax: 0,
        fee: 0,
        paidAmount: 2500000,
        note: "Contoh transaksi parsial sebelum tutup buku.",
        items: [
          { product: "Green Bean Robusta", desc: "Karung 50 kg", qty: 2, price: 2600000 }
        ],
        payments: [
          { date: "2026-06-28", amount: 2500000, account: "BRI Utama", ref: "TRX-006" }
        ],
        changes: ["Transaksi terbit dibuat sebelum tutup buku", "Pembayaran sebagian dicatat"]
      },
      {
        id: 11,
        code: "PUR-2026-0011",
        vendor: "UD Sinar Jaya",
        vendorRef: "SJ-099",
        date: "2026-06-26",
        dueDate: "2026-07-03",
        term: "7",
        transactionStatus: "Void",
        sourceData: "Unit Retail",
        paymentMethod: "Tunai",
        cashBankAccount: "Kas Utama",
        creator: "Siti Mulyani",
        discount: 0,
        tax: 0,
        fee: 0,
        paidAmount: 0,
        note: "Contoh transaksi void setelah periode ditutup.",
        voidReason: "Barang tidak jadi diterima dan periode transaksi sudah tutup buku.",
        voidedAt: "2026-07-13",
        voidedBy: "Owner/Admin",
        voidBookStatus: "closed",
        items: [
          { product: "Cup Paper 8oz", desc: "Isi 1500 pcs", qty: 1500, price: 1750 }
        ],
        payments: [],
        changes: ["Transaksi terbit dibuat sebelum tutup buku", "Transaksi di-void setelah tutup buku"]
      }
    ];

    function money(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(value || 0);
    }

    function parseDate(value) {
      return new Date(value + "T00:00:00");
    }

    function dateString(date) {
      return date.toISOString().slice(0, 10);
    }

    function addDays(dateValue, days) {
      const date = parseDate(dateValue);
      date.setDate(date.getDate() + Number(days));
      return dateString(date);
    }

    function dayDiff(dateValue) {
      return Math.round((parseDate(dateValue) - today) / 86400000);
    }

    function subtotalOf(inv) {
      return inv.items.reduce((sum, item) => sum + Number(item.qty) * Number(item.price), 0);
    }

    function totalOf(inv) {
      return subtotalOf(inv) - Number(inv.discount || 0) + Number(inv.tax || 0) + Number(inv.fee || 0);
    }

    function paidOf(inv) {
      return Number(inv.paidAmount || inv.paid || 0);
    }

    function remainingOf(inv) {
      return Math.max(totalOf(inv) - paidOf(inv), 0);
    }

    function hasPayment(inv) {
      return paidOf(inv) > 0 || (inv.payments && inv.payments.length > 0);
    }

    function canVoid(inv) {
      return inv && inv.transactionStatus !== "Void";
    }

    function isActiveDebt(inv) {
      return inv.transactionStatus !== "Void";
    }

    function bookStatusOf(inv) {
      if (inv.voidBookStatus) return inv.voidBookStatus;
      return inv.date < closedBookCutoffDate ? "closed" : "open";
    }

    function voidJournalText(inv) {
      if (bookStatusOf(inv) === "closed") {
        return `Sudah tutup buku: transaksi sebelum ${closedBookCutoffDate} perlu penyesuaian melalui jurnal pembalik manual. Fitur Void tidak membuat jurnal pembalik otomatis.`;
      }
      return `Belum tutup buku: transaksi pada atau setelah ${closedBookCutoffDate} disimulasikan menghapus jurnal transaksi dan jurnal pembayaran terkait.`;
    }

    function paymentStatusOf(inv) {
      const total = totalOf(inv);
      const paid = paidOf(inv);
      if (paid <= 0) return "Belum Dibayar";
      if (paid >= total) return "Lunas";
      return "Dibayar Sebagian";
    }

    function statusClass(status) {
      return {
        "Draft": "draft",
        "Terbit": "partial",
        "Void": "void",
        "Belum Dibayar": "unpaid",
        "Dibayar Sebagian": "partial",
        "Lunas": "paid"
      }[status] || "draft";
    }

    function isSalesModule() {
      return window.PROTOTYPE_CONFIG && window.PROTOTYPE_CONFIG.kind === "sales";
    }

    function moduleLabels() {
      return isSalesModule()
        ? {
          module: "Penjualan",
          contact: "Pelanggan",
          receivable: "Piutang",
          itemType: "Produk dan Jasa",
          autoJournalDebit: "Piutang Usaha",
          autoJournalCredit: "Penjualan"
        }
        : {
          module: "Pembelian",
          contact: "Vendor",
          receivable: "Hutang",
          itemType: "Produk",
          autoJournalDebit: "Persediaan / Beban Pembelian",
          autoJournalCredit: "Hutang Usaha"
        };
    }

    function dueLabel(inv) {
      if (paymentStatusOf(inv) === "Lunas" || inv.transactionStatus === "Void") return "";
      const diff = dayDiff(inv.dueDate);
      if (diff < 0) return "Terlambat";
      if (diff === 0) return "Hari ini";
      if (diff === 1) return "Besok";
      if ([3, 7, 14].includes(diff)) return `${diff} hari lagi`;
      return "";
    }

    function dueTone(inv) {
      if (paymentStatusOf(inv) === "Lunas" || inv.transactionStatus === "Void") return "";
      const diff = dayDiff(inv.dueDate);
      if (diff < 0) return "overdue";
      if (diff <= 7) return "soon";
      return "";
    }

    function dueTooltip(inv) {
      const tone = dueTone(inv);
      if (tone === "overdue") return "Terlambat: tanggal jatuh tempo sudah terlewati dan transaksi belum Lunas.";
      if (tone === "soon") return "Akan jatuh tempo dalam 7 hari atau kurang dan transaksi belum Lunas.";
      return "Tanggal jatuh tempo. Merah untuk terlambat, kuning untuk kurang atau sama dengan 7 hari.";
    }

    function dueMatches(inv, condition) {
      if (condition === "all") return true;
      if (inv.transactionStatus === "Void") return false;
      if (paymentStatusOf(inv) === "Lunas") return false;
      const diff = dayDiff(inv.dueDate);
      if (condition === "overdue") return diff < 0;
      if (condition === "today") return diff === 0;
      if (condition === "tomorrow") return diff === 1;
      return diff === Number(condition);
    }

    function nextCode() {
      const prefix = window.PROTOTYPE_CONFIG && window.PROTOTYPE_CONFIG.kind === "sales" ? "SAL" : "PUR";
      return `${prefix}-2026-${String(invoices.length + 1).padStart(4, "0")}`;
    }

    function defaultVendorName() {
      return Object.keys(vendors)[0] || "PT Maju Mapan";
    }

    function showToast(text) {
      const toast = document.getElementById("toast");
      document.getElementById("toastText").textContent = text;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2600);
    }

    function toggleSidebar() {
      const app = document.querySelector(".app");
      app.classList.toggle("sidebar-collapsed");
      localStorage.setItem("groappSidebarCollapsed", app.classList.contains("sidebar-collapsed") ? "1" : "0");
    }

    function restoreSidebarState() {
      if (localStorage.getItem("groappSidebarCollapsed") === "1") {
        document.querySelector(".app").classList.add("sidebar-collapsed");
      }
    }

    function uniqueValues(getter) {
      return [...new Set(invoices.map(getter).filter(Boolean))].sort();
    }

    function uniqueProducts() {
      return [...new Set(invoices.flatMap(inv => inv.items.map(item => item.product)))].sort();
    }

    function optionSets() {
      return {
        sources: uniqueValues(inv => inv.sourceData),
        vendors: uniqueValues(inv => inv.vendor),
        accounts: uniqueValues(inv => inv.cashBankAccount),
        products: uniqueProducts(),
        creators: uniqueValues(inv => inv.creator)
      };
    }

    function searchInputId(group) {
      return {
        sources: "sourceSearch",
        vendors: "vendorSearch",
        accounts: "accountSearch",
        products: "productSearch",
        creators: "creatorSearch"
      }[group];
    }

    function containerId(group) {
      return {
        sources: "filterSources",
        vendors: "filterVendors",
        accounts: "filterAccounts",
        products: "filterProducts",
        creators: "filterCreators"
      }[group];
    }

    function menuId(group) {
      return `${group}Menu`;
    }

    function triggerId(group) {
      return `${group}Trigger`;
    }

    function labelForGroup(group) {
      const count = (filters[group] || []).length;
      return count ? `${count} terpilih` : "Semua";
    }

    function updateMultiTrigger(group) {
      const trigger = document.getElementById(triggerId(group));
      if (!trigger) return;
      trigger.querySelector("span").textContent = labelForGroup(group);
    }

    function updateQuickSourceTrigger() {
      const count = filters.sources.length;
      document.querySelector("#quickSourcesTrigger span").textContent = count ? `${count} terpilih` : "Semua";
    }

    function toggleQuickSourceMenu() {
      document.querySelectorAll(".multi-menu").forEach(menu => {
        if (menu.id !== "quickSourcesMenu") menu.classList.remove("show");
      });
      const menu = document.getElementById("quickSourcesMenu");
      menu.classList.toggle("show");
      if (menu.classList.contains("show")) document.getElementById("quickSourceSearch").focus();
    }

    function renderQuickSourceOptions() {
      const options = optionSets().sources;
      const query = (document.getElementById("quickSourceSearch").value || "").toLowerCase();
      const selected = new Set(filters.sources);
      const visible = options.filter(option => option.toLowerCase().includes(query));
      document.getElementById("quickFilterSources").innerHTML = visible.map(option => `
        <label class="check-option">
          <input type="checkbox" value="${option}" ${selected.has(option) ? "checked" : ""} onchange="toggleQuickSourceValue(this.value, this.checked)" />
          <span>${option}</span>
        </label>
      `).join("") || `<div class="status-note">Tidak ada pilihan.</div>`;
    }

    function toggleQuickSourceValue(value, checked) {
      const selected = new Set(filters.sources);
      if (checked) selected.add(value);
      else selected.delete(value);
      filters.sources = [...selected];
      updateQuickSourceTrigger();
      renderMultiOptions("sources");
      renderList();
    }

    function toggleMultiMenu(group) {
      document.querySelectorAll(".multi-menu").forEach(menu => {
        if (menu.id !== menuId(group)) menu.classList.remove("show");
      });
      const menu = document.getElementById(menuId(group));
      menu.classList.toggle("show");
      if (menu.classList.contains("show")) {
        const search = document.getElementById(searchInputId(group));
        search.focus();
      }
    }

    function renderMultiOptions(group) {
      const options = optionSets()[group];
      const query = (document.getElementById(searchInputId(group)).value || "").toLowerCase();
      const selected = new Set(filters[group] || []);
      const visible = options.filter(option => option.toLowerCase().includes(query));
      document.getElementById(containerId(group)).innerHTML = visible.map(option => `
        <label class="check-option">
          <input type="checkbox" value="${option}" ${selected.has(option) ? "checked" : ""} onchange="toggleFilterValue('${group}', this.value, this.checked)" />
          <span>${option}</span>
        </label>
      `).join("") || `<div class="status-note">Tidak ada pilihan.</div>`;
    }

    function toggleFilterValue(group, value, checked) {
      const selected = new Set(filters[group] || []);
      if (checked) selected.add(value);
      else selected.delete(value);
      filters[group] = [...selected];
      updateMultiTrigger(group);
      if (group === "sources") {
        updateQuickSourceTrigger();
        renderQuickSourceOptions();
      }
    }

    function renderAllMultiOptions() {
      ["sources", "vendors", "accounts", "products", "creators"].forEach(group => {
        renderMultiOptions(group);
        updateMultiTrigger(group);
      });
    }

    function formatDateId(value) {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    }

    function updatePeriodLabels() {
      const label = `${formatDateId(filters.startDate)} - ${formatDateId(filters.endDate)}`;
      document.querySelector("#quickPeriodLabel span").textContent = label;
      document.querySelector("#filterPeriodLabel span").textContent = label;
    }

    function syncFilterControls() {
      document.getElementById("quickDue").value = filters.dueStatus;
      document.getElementById("filterPaymentMethod").value = filters.paymentMethod;
      document.getElementById("filterPaymentStatus").value = filters.paymentStatus;
      document.getElementById("filterTransactionStatus").value = filters.transactionStatus;
      document.getElementById("filterDueStatus").value = filters.dueStatus;
      updatePeriodLabels();
      syncDueFilterAvailability();
      renderAllMultiOptions();
      renderQuickSourceOptions();
      updateQuickSourceTrigger();
    }

    function validateDateRange(start, end) {
      if (!start || !end) return false;
      const startDate = parseDate(start);
      const endDate = parseDate(end);
      if (startDate > endDate) {
        showToast("Periode awal tidak boleh melebihi periode akhir.");
        return false;
      }
      if ((endDate - startDate) / 86400000 > 366) {
        showToast("Rentang periode maksimal satu tahun.");
        return false;
      }
      return true;
    }

    function setFiltersPeriod(start, end) {
      if (!validateDateRange(start, end)) return false;
      filters.startDate = start;
      filters.endDate = end;
      updatePeriodLabels();
      return true;
    }

    function renderCalendar(targetId, selectedDate) {
      const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
      const cells = [27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
      const selectedDay = Number(selectedDate.slice(8, 10));
      document.getElementById(targetId).innerHTML = [
        ...days.map(day => `<span class="muted">${day}</span>`),
        ...cells.map((day, idx) => {
          const muted = idx < 4 ? " muted" : "";
          const selected = day === selectedDay && idx >= 4 ? " selected" : "";
          const range = [17, 18, 19].includes(day) && idx >= 4 ? " range" : "";
          return `<span class="${muted}${selected}${range}">${day}</span>`;
        })
      ].join("");
    }

    function openPeriodModal(target) {
      periodTarget = target;
      periodDraft = { startDate: filters.startDate, endDate: filters.endDate };
      renderPeriodDraft();
      openModal("periodModal");
    }

    function renderPeriodDraft() {
      document.getElementById("periodDraftStart").textContent = formatDateId(periodDraft.startDate);
      document.getElementById("periodDraftEnd").textContent = formatDateId(periodDraft.endDate);
      renderCalendar("calendarStart", periodDraft.startDate);
      renderCalendar("calendarEnd", periodDraft.endDate);
    }

    function togglePeriodShortcuts() {
      document.getElementById("periodShortcuts").classList.toggle("show");
    }

    function setPeriodShortcut(type) {
      const end = dateString(today);
      let start = end;
      if (type === "week") start = addDays(end, -6);
      if (type === "month") start = addDays(end, -30);
      if (type === "quarter") start = addDays(end, -90);
      if (type === "year") {
        start = `${today.getFullYear()}-01-01`;
        periodDraft.endDate = `${today.getFullYear()}-12-31`;
      }
      if (type === "custom") {
        start = filters.startDate;
        periodDraft.endDate = filters.endDate;
      }
      periodDraft.startDate = start;
      if (type !== "custom" && type !== "year") periodDraft.endDate = end;
      renderPeriodDraft();
      document.getElementById("periodShortcuts").classList.remove("show");
    }

    function resetPeriodDraft() {
      periodDraft = { startDate: defaultPeriodStart, endDate: defaultPeriodEnd };
      renderPeriodDraft();
    }

    function applyPeriodDraft() {
      if (!setFiltersPeriod(periodDraft.startDate, periodDraft.endDate)) return;
      closeModal("periodModal");
      if (periodTarget === "quick") {
        applyQuickFilters();
      } else {
        syncFilterControls();
      }
    }

    function syncDueFilterAvailability() {
      const status = document.getElementById("filterPaymentStatus").value;
      const dueSelect = document.getElementById("filterDueStatus");
      const quickDue = document.getElementById("quickDue");
      const enabled = status === "all" || status === "Belum Dibayar" || status === "Dibayar Sebagian";
      dueSelect.disabled = !enabled;
      quickDue.disabled = !enabled && filters.paymentStatus !== "all";
      document.getElementById("dueFilterNote").textContent = enabled
        ? "Aktif saat status pembayaran belum lunas."
        : "Tidak tersedia ketika status pembayaran Lunas.";
      if (!enabled) {
        dueSelect.value = "all";
        quickDue.value = "all";
      }
    }

    function applyQuickFilters() {
      filters.dueStatus = document.getElementById("quickDue").value;
      syncFilterControls();
      renderList();
    }

    function setTransactionTab(status) {
      activeTransactionTab = status;
      selectedIds.clear();
      document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
      const active = document.querySelector(`.tab-btn[data-tab="${status}"]`);
      if (active) active.classList.add("active");
      renderList();
    }

    function sortColumn(key) {
      if (key !== "dueDate") {
        showToast("Sort tersedia pada kolom tanggal jatuh tempo.");
        return;
      }
      filters.sortDir = filters.sortDir === "asc" ? "desc" : "asc";
      renderList();
    }

    function renderSortArrows() {
      const el = document.getElementById("sort-dueDate");
      if (el) el.textContent = filters.sortDir === "asc" ? "↑" : "↓";
    }

    function toggleNotification(event) {
      event.stopPropagation();
      document.getElementById("notificationPopover").classList.toggle("show");
    }

    document.addEventListener("click", function(event) {
      const notif = document.getElementById("notificationPopover");
      if (notif && !notif.contains(event.target) && !event.target.classList.contains("bell")) {
        notif.classList.remove("show");
      }

      document.querySelectorAll(".kebab-menu").forEach(menu => {
        if (!menu.contains(event.target) && !event.target.classList.contains("action-btn")) {
          menu.classList.remove("show");
        }
      });

      if (!event.target.closest(".multi-select")) {
        document.querySelectorAll(".multi-menu").forEach(menu => menu.classList.remove("show"));
      }

      if (!event.target.closest(".period-shortcuts") && !event.target.closest(".period-head")) {
        const shortcuts = document.getElementById("periodShortcuts");
        if (shortcuts) shortcuts.classList.remove("show");
      }
    });

    function showPage(page) {
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

      if (page === "list") {
        document.getElementById("listPage").classList.add("active");
        document.getElementById("pageTitle").textContent = `Manajemen ${moduleLabels().module}`;
        document.getElementById("pageBreadcrumb").textContent = `Daftar ${moduleLabels().module}`;
        renderList();
      }

      if (page === "form") {
        document.getElementById("formPage").classList.add("active");
        document.getElementById("pageTitle").textContent = mode === "create" ? `Tambah ${moduleLabels().module}` : `Ubah ${moduleLabels().module}`;
        document.getElementById("pageBreadcrumb").textContent = mode === "create" ? `Daftar ${moduleLabels().module} / Tambah ${moduleLabels().module}` : `Daftar ${moduleLabels().module} / Ubah ${moduleLabels().module}`;
      }

      if (page === "detail") {
        document.getElementById("detailPage").classList.add("active");
        document.getElementById("pageTitle").textContent = `Detail ${moduleLabels().module}`;
        document.getElementById("pageBreadcrumb").textContent = `Daftar ${moduleLabels().module} / Detail ${moduleLabels().module}`;
        renderDetail();
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function filterBase(inv, includeTab = true) {
      const q = document.getElementById("searchInput").value.toLowerCase();
      const statusPayment = paymentStatusOf(inv);
      const date = inv.date;
      const matchesTab = !includeTab || activeTransactionTab === "all" || inv.transactionStatus === activeTransactionTab;
      const matchesSearch = inv.code.toLowerCase().includes(q) || inv.vendor.toLowerCase().includes(q);
      const matchesPeriod = date >= filters.startDate && date <= filters.endDate;
      const matchesSource = !filters.sources.length || filters.sources.includes(inv.sourceData);
      const matchesVendor = !filters.vendors.length || filters.vendors.includes(inv.vendor);
      const matchesPaymentMethod = filters.paymentMethod === "all" || inv.paymentMethod === filters.paymentMethod;
      const matchesAccount = !filters.accounts.length || filters.accounts.includes(inv.cashBankAccount);
      const matchesProduct = !filters.products.length || inv.items.some(item => filters.products.includes(item.product));
      const matchesPaymentStatus = filters.paymentStatus === "all" || statusPayment === filters.paymentStatus;
      const matchesTransactionStatus = filters.transactionStatus === "all" || inv.transactionStatus === filters.transactionStatus;
      const matchesCreator = !filters.creators.length || filters.creators.includes(inv.creator);
      const dueFilterEnabled = filters.paymentStatus === "all" || filters.paymentStatus === "Belum Dibayar" || filters.paymentStatus === "Dibayar Sebagian";
      const matchesDue = !dueFilterEnabled || dueMatches(inv, filters.dueStatus);

      return matchesTab
        && matchesSearch
        && matchesPeriod
        && matchesSource
        && matchesVendor
        && matchesPaymentMethod
        && matchesAccount
        && matchesProduct
        && matchesPaymentStatus
        && matchesTransactionStatus
        && matchesCreator
        && matchesDue;
    }

    function getFilteredInvoices(includeTab = true) {
      const data = invoices.filter(inv => filterBase(inv, includeTab));
      data.sort((a, b) => {
        const result = parseDate(a.dueDate) - parseDate(b.dueDate);
        return filters.sortDir === "asc" ? result : -result;
      });
      return data;
    }

    function renderTabCounts() {
      const filteredWithoutTab = getFilteredInvoices(false);
      document.getElementById("tabAllCount").textContent = filteredWithoutTab.length;
      document.getElementById("tabTerbitCount").textContent = filteredWithoutTab.filter(inv => inv.transactionStatus === "Terbit").length;
      document.getElementById("tabDraftCount").textContent = filteredWithoutTab.filter(inv => inv.transactionStatus === "Draft").length;
      document.getElementById("tabVoidCount").textContent = filteredWithoutTab.filter(inv => inv.transactionStatus === "Void").length;
    }

    function renderStats(data) {
      const totalPurchase = data.reduce((sum, inv) => sum + totalOf(inv), 0);
      const subtotal = data.reduce((sum, inv) => sum + subtotalOf(inv), 0);
      const tax = data.reduce((sum, inv) => sum + Number(inv.tax || 0), 0);
      const discount = data.reduce((sum, inv) => sum + Number(inv.discount || 0), 0);
      const activeData = data.filter(isActiveDebt);
      const activeTotal = activeData.reduce((sum, inv) => sum + totalOf(inv), 0);
      const paidTotal = activeData.filter(inv => paymentStatusOf(inv) === "Lunas").reduce((sum, inv) => sum + totalOf(inv), 0);
      const debtTotal = activeData.reduce((sum, inv) => sum + remainingOf(inv), 0);
      const paidPercent = activeTotal ? Math.round((paidTotal / activeTotal) * 100) : 0;
      const debtPercent = activeTotal ? Math.round((debtTotal / activeTotal) * 100) : 0;
      const dueData = activeData.filter(inv => dueTone(inv));
      const dueNominal = dueData.reduce((sum, inv) => sum + remainingOf(inv), 0);
      const drafts = data.filter(inv => inv.transactionStatus === "Draft");
      const draftNominal = drafts.reduce((sum, inv) => sum + totalOf(inv), 0);

      document.getElementById("statTotal").textContent = money(totalPurchase);
      document.getElementById("statTotalBreakdown").textContent = `Omzet ${money(subtotal)} · Pajak ${money(tax)} · Diskon ${money(discount)}`;
      document.getElementById("paidPercent").textContent = `${paidPercent}%`;
      document.getElementById("paidNominal").textContent = `Lunas ${money(paidTotal)}`;
      document.getElementById("debtPercent").textContent = `${debtPercent}%`;
      document.getElementById("debtNominal").textContent = `${moduleLabels().receivable} ${money(debtTotal)}`;
      document.getElementById("dueThisMonth").textContent = `${dueData.length} transaksi`;
      document.getElementById("dueNominal").textContent = money(dueNominal);
      document.getElementById("draftCount").textContent = drafts.length;
      document.getElementById("draftNominal").textContent = money(draftNominal);
    }

    function actionItems(inv) {
      if (inv.transactionStatus === "Draft") {
        const items = [
          ["Lanjutkan Transaksi", `openAction('continue', ${inv.id})`],
          ["Cetak", `openAction('print', ${inv.id})`],
          ["Unduh PDF", `openAction('pdf', ${inv.id})`],
          ["Share WhatsApp", `openAction('wa', ${inv.id})`],
          ["Share Email", `openAction('email', ${inv.id})`]
        ];
        if (canVoid(inv)) items.splice(1, 0, ["Void", `cancelFromList(${inv.id})`, "danger"]);
        return items;
      }
      if (inv.transactionStatus === "Void") {
        return [
          ["Detail", `openDetailFromMenu(${inv.id})`],
          ["Cetak", `openAction('print', ${inv.id})`],
          ["Unduh PDF", `openAction('pdf', ${inv.id})`],
          ["Share WhatsApp", `openAction('wa', ${inv.id})`],
          ["Share Email", `openAction('email', ${inv.id})`]
        ];
      }
      const items = [
        ["Detail", `openDetailFromMenu(${inv.id})`],
        ["Cetak", `openAction('print', ${inv.id})`],
        ["Unduh PDF", `openAction('pdf', ${inv.id})`],
        ["Share WhatsApp", `openAction('wa', ${inv.id})`],
        ["Share Email", `openAction('email', ${inv.id})`]
      ];
      if (canVoid(inv)) items.splice(1, 0, ["Void", `cancelFromList(${inv.id})`, "danger"]);
      return items;
    }

    function renderList() {
      const data = getFilteredInvoices(true);
      const statsData = getFilteredInvoices(false);
      renderTabCounts();
      renderStats(statsData);
      renderSortArrows();

      const rows = document.getElementById("invoiceRows");
      rows.innerHTML = data.map(inv => {
        const status = paymentStatusOf(inv);
        const total = totalOf(inv);
        const remaining = remainingOf(inv);
        const tone = dueTone(inv);
        const checked = selectedIds.has(inv.id) ? "checked" : "";
        const actions = actionItems(inv).map(action => `
          <button class="kebab-item ${action[2] || ""}" onclick="${action[1]}">${action[0]}</button>
        `).join("");

        return `
          <tr>
            <td class="check-cell"><input type="checkbox" ${checked} onchange="toggleRowSelection(${inv.id}, this.checked)" /></td>
            <td>
              <button class="link-btn" onclick="openDetail(${inv.id})">${inv.code}</button>
            </td>
            <td>
              <button class="link-btn" onclick="openVendorDetail('${inv.vendor}')">${inv.vendor}</button>
            </td>
            <td>${inv.date}</td>
            <td class="due-cell ${tone}" title="${dueTooltip(inv)}">${inv.dueDate}</td>
            <td class="amount">${money(total)}</td>
            <td>${money(remaining)}</td>
            <td><span class="badge ${statusClass(status)}">${status}</span></td>
            <td>
              <div class="kebab-wrap">
                <button class="action-btn" onclick="toggleActionMenu(event, ${inv.id})">•••</button>
                <div class="kebab-menu" id="action-menu-${inv.id}">
                  ${actions}
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      if (!data.length) {
        rows.innerHTML = `<tr><td colspan="9"><div class="empty">Data transaksi tidak ditemukan.</div></td></tr>`;
      }
      renderBulkBar(data);
    }

    function renderBulkBar(data) {
      const visibleIds = new Set(data.map(inv => inv.id));
      [...selectedIds].forEach(id => {
        if (!visibleIds.has(id)) selectedIds.delete(id);
      });
      const count = selectedIds.size;
      document.getElementById("bulkBar").classList.toggle("show", count > 0);
      document.getElementById("bulkInfo").textContent = `${count} transaksi dipilih`;
      const selectAll = document.getElementById("selectAll");
      if (selectAll) {
        selectAll.checked = count > 0 && data.length > 0 && data.every(inv => selectedIds.has(inv.id));
      }
    }

    function toggleRowSelection(id, checked) {
      if (checked) selectedIds.add(id);
      else selectedIds.delete(id);
      renderList();
    }

    function toggleSelectAll(checked) {
      const data = getFilteredInvoices(true);
      data.forEach(inv => {
        if (checked) selectedIds.add(inv.id);
        else selectedIds.delete(inv.id);
      });
      renderList();
    }

    function toggleActionMenu(event, id) {
      event.stopPropagation();
      document.querySelectorAll(".kebab-menu").forEach(menu => {
        if (menu.id !== `action-menu-${id}`) menu.classList.remove("show");
      });
      document.getElementById(`action-menu-${id}`).classList.toggle("show");
    }

    function openDetailFromMenu(id) {
      document.querySelectorAll(".kebab-menu").forEach(menu => menu.classList.remove("show"));
      openDetail(id);
    }

    function cancelFromList(id) {
      document.querySelectorAll(".kebab-menu").forEach(menu => menu.classList.remove("show"));
      selectedId = id;
      openCancelModal();
    }

    function openForm(type) {
      mode = type;
      itemCounter = 0;
      document.getElementById("itemRows").innerHTML = "";

      if (type === "create") {
        const source = copySourceAfterVoid;
        createSourceTemplate = source ? { ...source } : null;
        copySourceAfterVoid = null;
        selectedId = null;
        document.getElementById("formTitle").textContent = `Tambah ${moduleLabels().module}`;
        document.getElementById("codeInput").value = nextCode();
        document.getElementById("vendorInput").value = source ? source.vendor : defaultVendorName();
        document.getElementById("dateInput").value = source ? source.date : dateString(today);
        document.getElementById("termInput").value = source ? source.term : "30";
        document.getElementById("vendorRefInput").value = source ? source.vendorRef : "";
        document.getElementById("noteInput").value = source ? source.note || "" : "";
        document.getElementById("discountInput").value = source ? source.discount || 0 : 0;
        document.getElementById("taxInput").value = source ? source.tax || 0 : 0;
        document.getElementById("feeInput").value = source ? source.fee || 0 : 0;
        if (source && source.term === "custom") {
          document.getElementById("dueInput").value = source.dueDate;
          document.getElementById("dueInput").disabled = false;
          document.getElementById("dueInput").classList.remove("disabled");
        } else {
          applyTerm();
        }
        const sourceItems = source ? source.items : [{ product: "Biji Kopi Arabika", desc: "Grade A, 25 kg", qty: 2, price: 1200000 }];
        sourceItems.forEach(item => addItem(item.product, item.desc, item.qty, item.price));
      }

      if (type === "edit") {
        const inv = invoices.find(i => i.id === selectedId);
        if (!inv) return;
        if (inv.transactionStatus === "Void") {
          showToast("Transaksi Void tidak dapat diubah.");
          showPage("detail");
          return;
        }

        document.getElementById("formTitle").textContent = inv.transactionStatus === "Draft" ? `Lanjutkan ${moduleLabels().module}` : `Ubah ${moduleLabels().module}`;
        document.getElementById("codeInput").value = inv.code;
        document.getElementById("vendorInput").value = inv.vendor;
        document.getElementById("dateInput").value = inv.date;
        document.getElementById("dueInput").value = inv.dueDate;
        document.getElementById("termInput").value = inv.term;
        document.getElementById("vendorRefInput").value = inv.vendorRef;
        document.getElementById("noteInput").value = inv.note || "";
        document.getElementById("discountInput").value = inv.discount || 0;
        document.getElementById("taxInput").value = inv.tax || 0;
        document.getElementById("feeInput").value = inv.fee || 0;
        inv.items.forEach(item => addItem(item.product, item.desc, item.qty, item.price));
        applyTerm();
      }

      calculateTotal();
      showPage("form");
    }

    function addItem(product = "", desc = "", qty = 1, price = 0) {
      const container = document.getElementById("itemRows");
      const id = `item-${itemCounter++}`;
      const row = document.createElement("div");
      row.className = "item-row";
      row.id = id;
      row.innerHTML = `
        <input class="mini-input product" value="${product}" placeholder="Produk/Jasa" />
        <input class="mini-input desc" value="${desc}" placeholder="Deskripsi" />
        <input class="mini-input qty" type="number" value="${qty}" oninput="calculateTotal()" />
        <input class="mini-input price" type="number" value="${price}" oninput="calculateTotal()" />
        <input class="mini-input line-total disabled" disabled />
        <button class="remove" onclick="removeItem('${id}')">×</button>
      `;
      container.appendChild(row);
      calculateTotal();
    }

    function removeItem(id) {
      if (document.querySelectorAll("#itemRows .item-row").length <= 1) {
        showToast(`Minimal harus ada 1 item ${moduleLabels().module.toLowerCase()}.`);
        return;
      }
      document.getElementById(id).remove();
      calculateTotal();
    }

    function getFormItems() {
      return [...document.querySelectorAll("#itemRows .item-row")].map(row => ({
        product: row.querySelector(".product").value || `Item ${moduleLabels().module}`,
        desc: row.querySelector(".desc").value || "-",
        qty: Number(row.querySelector(".qty").value || 0),
        price: Number(row.querySelector(".price").value || 0)
      })).filter(item => item.qty > 0 && item.price > 0);
    }

    function calculateTotal() {
      let subtotal = 0;
      document.querySelectorAll("#itemRows .item-row").forEach(row => {
        const qty = Number(row.querySelector(".qty").value || 0);
        const price = Number(row.querySelector(".price").value || 0);
        const total = qty * price;
        row.querySelector(".line-total").value = money(total);
        subtotal += total;
      });
      const discount = Number(document.getElementById("discountInput").value || 0);
      const tax = Number(document.getElementById("taxInput").value || 0);
      const fee = Number(document.getElementById("feeInput").value || 0);
      document.getElementById("subtotalText").textContent = money(subtotal);
      document.getElementById("totalText").textContent = money(subtotal - discount + tax + fee);
    }

    function applyTerm() {
      const term = document.getElementById("termInput").value;
      const date = document.getElementById("dateInput").value;
      const dueInput = document.getElementById("dueInput");
      if (!date) return;
      if (term === "custom") {
        dueInput.disabled = false;
        dueInput.classList.remove("disabled");
        return;
      }
      dueInput.value = addDays(date, Number(term));
      dueInput.disabled = true;
      dueInput.classList.add("disabled");
    }

    function submitInvoice(statusValue) {
      const items = getFormItems();
      if (!items.length) {
        showToast(`Item ${moduleLabels().module.toLowerCase()} belum valid.`);
        return;
      }

      const oldInvoice = invoices.find(inv => inv.id === selectedId);
      const template = mode === "create" ? createSourceTemplate : null;
      const transactionStatus = statusValue === "Draft" ? "Draft" : "Terbit";
      const payload = {
        id: mode === "create" ? Date.now() : selectedId,
        code: document.getElementById("codeInput").value,
        vendor: document.getElementById("vendorInput").value,
        vendorRef: document.getElementById("vendorRefInput").value,
        date: document.getElementById("dateInput").value,
        dueDate: document.getElementById("dueInput").value,
        term: document.getElementById("termInput").value,
        transactionStatus,
        sourceData: oldInvoice ? oldInvoice.sourceData : template ? template.sourceData : "Perusahaan Kopi Nusantara",
        paymentMethod: oldInvoice ? oldInvoice.paymentMethod : template ? template.paymentMethod : "Transfer Bank",
        cashBankAccount: oldInvoice ? oldInvoice.cashBankAccount : template ? template.cashBankAccount : "BCA Operasional",
        creator: oldInvoice ? oldInvoice.creator : template ? template.creator : "Siti Mulyani",
        discount: Number(document.getElementById("discountInput").value || 0),
        tax: Number(document.getElementById("taxInput").value || 0),
        fee: Number(document.getElementById("feeInput").value || 0),
        note: document.getElementById("noteInput").value,
        paidAmount: oldInvoice ? paidOf(oldInvoice) : 0,
        items,
        payments: oldInvoice ? oldInvoice.payments : [],
        changes: oldInvoice
          ? [...oldInvoice.changes, transactionStatus === "Draft" ? "Draft diperbarui" : "Transaksi diterbitkan/diperbarui"]
          : template
            ? [`Salinan dibuat dari transaksi Void ${template.code}`, transactionStatus === "Draft" ? `Draft ${moduleLabels().module.toLowerCase()} dibuat` : "Transaksi terbit dibuat"]
            : [transactionStatus === "Draft" ? `Draft ${moduleLabels().module.toLowerCase()} dibuat` : "Transaksi terbit dibuat"]
      };

      if (mode === "create") {
        invoices.unshift(payload);
      } else {
        const index = invoices.findIndex(inv => inv.id === selectedId);
        invoices[index] = payload;
      }

      selectedId = payload.id;
      createSourceTemplate = null;
      activeTransactionTab = payload.transactionStatus;
      showToast(transactionStatus === "Draft" ? `Draft ${moduleLabels().module.toLowerCase()} berhasil disimpan.` : `${moduleLabels().module} berhasil diterbitkan.`);
      showPage("detail");
    }

    function openDetail(id) {
      selectedId = id;
      showPage("detail");
    }

    function renderDetail() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!inv) return;
      const status = paymentStatusOf(inv);
      const subtotal = subtotalOf(inv);
      const total = totalOf(inv);
      const remaining = remainingOf(inv);
      const tone = dueTone(inv);
      const voidNotice = document.getElementById("detailVoidNotice");

      document.getElementById("detailCode").textContent = inv.code;
      document.getElementById("detailVendor").textContent = inv.vendor;
      document.getElementById("detailStatus").innerHTML = `<span class="badge ${statusClass(inv.transactionStatus)}">${inv.transactionStatus}</span>`;
      const detailPaymentStatus = document.getElementById("detailPaymentStatus");
      if (detailPaymentStatus) detailPaymentStatus.innerHTML = `<span class="badge ${statusClass(status)}">${status}</span>`;
      document.getElementById("detailRef").textContent = inv.vendorRef || "-";
      document.getElementById("detailDate").textContent = inv.date;
      document.getElementById("detailDue").innerHTML = `<span class="due-cell ${tone}" title="${dueTooltip(inv)}">${inv.dueDate}</span>`;
      if (voidNotice) {
        voidNotice.classList.toggle("show", inv.transactionStatus === "Void");
        if (inv.transactionStatus === "Void") {
          document.getElementById("voidReasonText").textContent = inv.voidReason || inv.note || "Alasan pembatalan belum tercatat pada data lama.";
          document.getElementById("voidDateText").textContent = inv.voidedAt || dateString(today);
          document.getElementById("voidJournalText").textContent = voidJournalText(inv);
        }
      }

      document.getElementById("detailItems").innerHTML = inv.items.map(item => `
        <tr>
          <td>${item.product}</td>
          <td>${item.desc}</td>
          <td>${item.qty}</td>
          <td>${money(item.price)}</td>
          <td class="amount">${money(item.qty * item.price)}</td>
        </tr>
      `).join("");

      document.getElementById("detailSubtotal").textContent = money(subtotal);
      document.getElementById("detailDiscount").textContent = money(inv.discount);
      document.getElementById("detailTax").textContent = money(inv.tax);
      document.getElementById("detailFee").textContent = money(inv.fee);
      document.getElementById("detailTotal").textContent = money(total);
      document.getElementById("detailRemaining").textContent = money(remaining);
      const editBtn = document.getElementById("editBtn");
      if (editBtn) editBtn.style.display = inv.transactionStatus === "Void" ? "none" : "inline-flex";
      document.getElementById("paymentBtn").style.display =
        status === "Lunas" || inv.transactionStatus !== "Terbit" ? "none" : "inline-flex";
      document.getElementById("cancelBtn").style.display =
        canVoid(inv) ? "inline-flex" : "none";

      document.getElementById("paymentHistory").innerHTML = inv.payments.length
        ? inv.payments.map(p => `
          <div class="history-item">
            <div>
              <div class="main-text">${money(p.amount)}</div>
              <div class="sub-text">${p.account} · ${p.ref || "-"}</div>
            </div>
            <div class="sub-text">${p.date}</div>
          </div>
        `).join("")
        : `<div class="empty">Belum ada pembayaran.</div>`;

      document.getElementById("changeHistory").innerHTML = inv.changes.map((c, idx) => `
        <div class="history-item">
          <div>
            <div class="main-text">${c}</div>
            <div class="sub-text">Dicatat oleh ${inv.creator}</div>
          </div>
          <div class="sub-text">${idx === 0 ? inv.date : dateString(today)}</div>
        </div>
      `).join("");
    }

    function openJournal() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!inv) return;
      const journalSubtitle = document.getElementById("journalSubtitle");
      if (journalSubtitle) {
        journalSubtitle.textContent = inv.transactionStatus === "Void"
          ? "Perlakuan jurnal mengikuti status tutup buku saat transaksi di-void."
          : "Jurnal dibuat otomatis dari tagihan dan pembayaran.";
      }
      if (inv.transactionStatus === "Void") {
        document.getElementById("journalRows").innerHTML = `
          <tr>
            <td colspan="4">
              <div class="journal-empty">
                <strong>Transaksi Void</strong>
                <span>${voidJournalText(inv)}</span>
              </div>
            </td>
          </tr>
        `;
        openModal("journalModal");
        return;
      }
      const total = totalOf(inv);
      const rows = isSalesModule()
        ? [
          { date: inv.date, account: moduleLabels().autoJournalDebit, debit: total, credit: 0 },
          { date: inv.date, account: moduleLabels().autoJournalCredit, debit: 0, credit: total }
        ]
        : [
          { date: inv.date, account: moduleLabels().autoJournalDebit, debit: total, credit: 0 },
          { date: inv.date, account: moduleLabels().autoJournalCredit, debit: 0, credit: total }
        ];
      inv.payments.forEach(p => {
        rows.push({ date: p.date, account: moduleLabels().autoJournalDebit, debit: isSalesModule() ? 0 : p.amount, credit: isSalesModule() ? p.amount : 0 });
        rows.push({ date: p.date, account: p.account, debit: isSalesModule() ? p.amount : 0, credit: isSalesModule() ? 0 : p.amount });
      });
      document.getElementById("journalRows").innerHTML = rows.map(r => `
        <tr>
          <td>${r.date}</td>
          <td>${r.account}</td>
          <td>${r.debit ? money(r.debit) : "-"}</td>
          <td>${r.credit ? money(r.credit) : "-"}</td>
        </tr>
      `).join("");
      openModal("journalModal");
    }

    function openPayment() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!inv) return;
      if (inv.transactionStatus === "Void") {
        showToast("Transaksi Void tidak dapat menerima pembayaran.");
        return;
      }
      const remaining = remainingOf(inv);
      document.getElementById("paymentInfo").textContent = `Sisa tagihan: ${money(remaining)}`;
      document.getElementById("paymentAmount").value = remaining;
      document.getElementById("paymentDate").value = dateString(today);
      document.getElementById("paymentRef").value = "";
      openModal("paymentModal");
    }

    function openStandalonePayment() {
      const target = invoices.find(inv => inv.transactionStatus === "Terbit" && paymentStatusOf(inv) !== "Lunas");
      if (!target) {
        showToast("Tidak ada transaksi terbit yang masih memiliki sisa tagihan.");
        return;
      }
      selectedId = target.id;
      openPayment();
    }

    function savePayment() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!inv) return;
      if (inv.transactionStatus === "Void") {
        showToast("Transaksi Void tidak dapat menerima pembayaran.");
        closeModal("paymentModal");
        return;
      }
      const remaining = remainingOf(inv);
      const amount = Number(document.getElementById("paymentAmount").value || 0);
      if (amount <= 0) {
        showToast("Nominal pembayaran harus lebih dari 0.");
        return;
      }
      if (amount > remaining) {
        showToast("Nominal melebihi sisa tagihan.");
        return;
      }
      inv.payments.push({
        date: document.getElementById("paymentDate").value,
        amount,
        account: document.getElementById("paymentAccount").value,
        ref: document.getElementById("paymentRef").value || "-"
      });
      inv.paidAmount = paidOf(inv) + amount;
      inv.changes.push(paymentStatusOf(inv) === "Lunas" ? "Pembayaran dicatat dan tagihan lunas" : "Pembayaran sebagian dicatat");
      closeModal("paymentModal");
      showToast("Pembayaran berhasil dicatat.");
      renderDetail();
      renderList();
    }

    function openCancelModal() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!canVoid(inv)) {
        showToast("Transaksi Void tidak dapat di-void ulang.");
        return;
      }
      document.getElementById("cancelReason").value = "";
      document.querySelector("input[name='cancelOption'][value='void']").checked = true;
      renderCancelModal();
      openModal("cancelModal");
    }

    function renderCancelModal() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!inv) return;
      const hasPaymentRecorded = hasPayment(inv);
      document.getElementById("cancelTargetCode").textContent = inv.code;
      document.getElementById("cancelTargetStatus").textContent = `${inv.transactionStatus} · ${paymentStatusOf(inv)}`;
      document.getElementById("cancelPaymentWarning").classList.toggle("show", hasPaymentRecorded);
      document.getElementById("cancelPaymentWarning").textContent = hasPaymentRecorded
        ? "Transaksi ini sudah memiliki pembayaran. Perlakuan atas pembayaran mengikuti kebijakan perusahaan dan penyesuaian dilakukan manual bila diperlukan."
        : "";
      document.getElementById("cancelJournalInfo").textContent = voidJournalText(inv);
    }

    function confirmCancel() {
      const inv = invoices.find(i => i.id === selectedId);
      if (!canVoid(inv)) {
        showToast("Transaksi Void tidak dapat di-void ulang.");
        closeModal("cancelModal");
        return;
      }
      const reason = document.getElementById("cancelReason").value.trim();
      if (!reason) {
        showToast("Alasan pembatalan wajib diisi.");
        document.getElementById("cancelReason").focus();
        return;
      }
      const option = document.querySelector("input[name='cancelOption']:checked").value;
      const bookStatus = bookStatusOf(inv);
      const sourceForCopy = {
        ...inv,
        items: inv.items.map(item => ({ ...item }))
      };
      inv.transactionStatus = "Void";
      inv.voidReason = reason;
      inv.voidedAt = dateString(today);
      inv.voidedBy = "Owner/Admin";
      inv.voidBookStatus = bookStatus;
      inv.changes.push(`Transaksi di-void oleh Owner/Admin. Alasan: ${reason}`);
      activeTransactionTab = "Void";
      closeModal("cancelModal");
      if (option === "copy") {
        copySourceAfterVoid = sourceForCopy;
        showToast("Transaksi lama di-void. Form salinan baru dibuka.");
        openForm("create");
        return;
      }
      showToast("Transaksi berhasil di-void.");
      showPage("list");
    }

    function safeFileName(value) {
      return String(value).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    }

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }

    function transactionDocumentRows(inv) {
      const rows = [
        [`Dokumen ${moduleLabels().module}`],
        ["Nomor Transaksi", inv.code],
        [moduleLabels().contact, inv.vendor],
        ["Tanggal Transaksi", inv.date],
        ["Tanggal Jatuh Tempo", inv.dueDate],
        ["Status Transaksi", inv.transactionStatus],
        ["Status Pembayaran", paymentStatusOf(inv)],
        ["Total Tagihan", money(totalOf(inv))],
        ["Sisa Tagihan", money(remainingOf(inv))]
      ];
      if (inv.transactionStatus === "Void") {
        rows.push(["Alasan Void", inv.voidReason || "-"]);
        rows.push(["Perlakuan Jurnal", voidJournalText(inv)]);
      }
      rows.push([""]);
      rows.push(["Produk/Jasa", "Deskripsi", "Qty", "Harga", "Subtotal"]);
      inv.items.forEach(item => {
        rows.push([item.product, item.desc, item.qty, money(item.price), money(item.qty * item.price)]);
      });
      return rows;
    }

    function transactionShareText(inv) {
      return [
        `${moduleLabels().module} ${inv.code}`,
        `${moduleLabels().contact}: ${inv.vendor}`,
        `Tanggal: ${inv.date}`,
        `Jatuh tempo: ${inv.dueDate}`,
        `Status transaksi: ${inv.transactionStatus}`,
        `Status pembayaran: ${paymentStatusOf(inv)}`,
        `Total: ${money(totalOf(inv))}`,
        `Sisa: ${money(remainingOf(inv))}`,
        inv.transactionStatus === "Void" ? `Alasan Void: ${inv.voidReason || "-"}` : ""
      ].filter(Boolean).join("\n");
    }

    function downloadTransactionPdf(inv) {
      const blob = createPdfBlob(transactionDocumentRows(inv));
      downloadBlob(blob, `${safeFileName(inv.code)}.pdf`);
      showToast(`PDF ${inv.code} berhasil diunduh.`);
    }

    function printTransactions(data) {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        showToast("Pop-up cetak diblokir browser. Izinkan pop-up lalu coba lagi.");
        return;
      }
      const title = data.length === 1 ? `${moduleLabels().module} ${data[0].code}` : `Daftar ${moduleLabels().module}`;
      const cards = data.map(inv => `
        <section class="doc">
          ${inv.transactionStatus === "Void" ? `<div class="watermark">VOID</div>` : ""}
          <h1>${title}</h1>
          <table>
            <tr><th>Nomor</th><td>${inv.code}</td></tr>
            <tr><th>${moduleLabels().contact}</th><td>${inv.vendor}</td></tr>
            <tr><th>Tanggal</th><td>${inv.date}</td></tr>
            <tr><th>Jatuh Tempo</th><td>${inv.dueDate}</td></tr>
            <tr><th>Status Transaksi</th><td>${inv.transactionStatus}</td></tr>
            <tr><th>Status Pembayaran</th><td>${paymentStatusOf(inv)}</td></tr>
            <tr><th>Total</th><td>${money(totalOf(inv))}</td></tr>
            <tr><th>Sisa</th><td>${money(remainingOf(inv))}</td></tr>
            ${inv.transactionStatus === "Void" ? `<tr><th>Alasan Void</th><td>${inv.voidReason || "-"}</td></tr>` : ""}
          </table>
        </section>
      `).join("");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #222; margin: 24px; }
            .doc { page-break-after: always; position: relative; border: 1px solid #ddd; padding: 24px; }
            .doc:last-child { page-break-after: auto; }
            h1 { font-size: 20px; margin: 0 0 18px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border-bottom: 1px solid #eee; padding: 10px; text-align: left; vertical-align: top; }
            th { width: 190px; color: #666; }
            .watermark { position: absolute; right: 24px; top: 20px; border: 2px solid #ef233c; color: #ef233c; padding: 8px 16px; font-size: 24px; font-weight: 800; transform: rotate(-6deg); }
          </style>
        </head>
        <body>${cards}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 300);
      showToast(data.length === 1 ? `Dialog cetak ${data[0].code} dibuka.` : `Dialog cetak ${data.length} transaksi dibuka.`);
    }

    function sendTransactionEmail(data) {
      const first = data[0];
      const recipient = data.length === 1 && vendors[first.vendor] ? vendors[first.vendor].email : "";
      const subject = data.length === 1 ? `${moduleLabels().module} ${first.code}` : `Daftar ${moduleLabels().module}`;
      const body = data.map(transactionShareText).join("\n\n---\n\n");
      window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast(data.length === 1 ? `Email ${first.code} dibuka.` : `Email ${data.length} transaksi dibuka.`);
    }

    function sendTransactionWhatsApp(data) {
      const text = data.map(transactionShareText).join("\n\n---\n\n");
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      showToast(data.length === 1 ? `WhatsApp ${data[0].code} dibuka.` : `WhatsApp ${data.length} transaksi dibuka.`);
    }

    function openAction(action, id) {
      const inv = invoices.find(i => i.id === id);
      document.querySelectorAll(".kebab-menu").forEach(menu => menu.classList.remove("show"));
      if (!inv) return;
      if (action === "continue") {
        selectedId = id;
        openForm("edit");
        return;
      }
      if (action === "print") printTransactions([inv]);
      if (action === "pdf") downloadTransactionPdf(inv);
      if (action === "wa") sendTransactionWhatsApp([inv]);
      if (action === "email") sendTransactionEmail([inv]);
    }

    function bulkAction(action) {
      if (!selectedIds.size) return;
      const selectedData = invoices.filter(inv => selectedIds.has(inv.id));
      if (action === "export") {
        openExportModal("filtered", [...selectedIds]);
        return;
      }
      if (action === "print") printTransactions(selectedData);
      if (action === "pdf") openExportModal("filtered", [...selectedIds]);
      if (action === "wa") sendTransactionWhatsApp(selectedData);
      if (action === "email") sendTransactionEmail(selectedData);
    }

    function exportDataForScope(scope) {
      if (exportSelectedIds && scope === "filtered") return invoices.filter(inv => exportSelectedIds.includes(inv.id));
      const filteredData = getFilteredInvoices(false);
      const statusScopes = {
        draft: "Draft",
        terbit: "Terbit",
        void: "Void"
      };
      if (scope === "all") return invoices;
      if (statusScopes[scope]) return filteredData.filter(inv => inv.transactionStatus === statusScopes[scope]);
      return filteredData;
    }

    function setExportScope(scope) {
      exportScope = scope;
      ["filtered", "draft", "terbit", "void", "all"].forEach(item => {
        const key = { all: "All", filtered: "Filtered", draft: "Draft", terbit: "Terbit", void: "Void" }[item];
        const option = document.getElementById(`exportOption${key}`);
        if (option) option.classList.toggle("active", item === scope);
      });
      const count = exportDataForScope(scope).length;
      const labels = {
        filtered: exportSelectedIds ? "transaksi terpilih" : "data sesuai filter dan search",
        draft: "draft sesuai filter dan search",
        terbit: "transaksi terbit sesuai filter dan search",
        void: "transaksi void sesuai filter dan search",
        all: "semua data"
      };
      const label = labels[scope] || labels.filtered;
      document.getElementById("exportSummary").textContent = `${count} ${label} akan diekspor dalam file ${exportFormat === "excel" ? "Excel" : "PDF"}.`;
    }

    function setExportFormat(format) {
      exportFormat = format;
      document.getElementById("exportFormatExcel").classList.toggle("active", format === "excel");
      document.getElementById("exportFormatPdf").classList.toggle("active", format === "pdf");
      setExportScope(exportScope);
    }

    function openExportModal(scope = "filtered", ids = null) {
      exportSelectedIds = ids;
      const filteredData = exportSelectedIds ? invoices.filter(inv => exportSelectedIds.includes(inv.id)) : getFilteredInvoices(false);
      document.getElementById("exportFilteredCount").textContent = `${filteredData.length} Item`;
      document.getElementById("exportDraftCount").textContent = `${filteredData.filter(inv => inv.transactionStatus === "Draft").length} Item`;
      document.getElementById("exportTerbitCount").textContent = `${filteredData.filter(inv => inv.transactionStatus === "Terbit").length} Item`;
      document.getElementById("exportVoidCount").textContent = `${filteredData.filter(inv => inv.transactionStatus === "Void").length} Item`;
      document.getElementById("exportAllCount").textContent = `${invoices.length} Item`;
      setExportScope(scope);
      setExportFormat(exportFormat);
      openModal("exportModal");
    }

    function exportNow() {
      exportFiltered(exportFormat, exportDataForScope(exportScope).map(inv => inv.id));
      closeModal("exportModal");
      exportSelectedIds = null;
    }

    function escapeXml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    }

    function excelColumnName(index) {
      let name = "";
      let number = index + 1;
      while (number > 0) {
        const remainder = (number - 1) % 26;
        name = String.fromCharCode(65 + remainder) + name;
        number = Math.floor((number - 1) / 26);
      }
      return name;
    }

    function worksheetXml(rows) {
      const sheetData = rows.map((row, rowIndex) => {
        const cells = row.map((cell, columnIndex) => {
          const ref = `${excelColumnName(columnIndex)}${rowIndex + 1}`;
          if (typeof cell === "number") return `<c r="${ref}"><v>${cell}</v></c>`;
          return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(cell)}</t></is></c>`;
        }).join("");
        return `<row r="${rowIndex + 1}">${cells}</row>`;
      }).join("");
      return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>${sheetData}</sheetData>
</worksheet>`;
    }

    function crc32(bytes) {
      let crc = -1;
      for (let i = 0; i < bytes.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
      }
      return (crc ^ -1) >>> 0;
    }

    const crcTable = Array.from({ length: 256 }, (_, n) => {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      return c >>> 0;
    });

    function writeUint16(bytes, value) {
      bytes.push(value & 0xff, (value >>> 8) & 0xff);
    }

    function writeUint32(bytes, value) {
      bytes.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
    }

    function appendBytes(target, source) {
      source.forEach(byte => target.push(byte));
    }

    function createZip(files) {
      const encoder = new TextEncoder();
      const chunks = [];
      const centralDirectory = [];
      let offset = 0;
      const now = new Date();
      const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
      const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

      files.forEach(file => {
        const nameBytes = encoder.encode(file.name);
        const contentBytes = encoder.encode(file.content);
        const crc = crc32(contentBytes);
        const local = [];

        writeUint32(local, 0x04034b50);
        writeUint16(local, 20);
        writeUint16(local, 0);
        writeUint16(local, 0);
        writeUint16(local, dosTime);
        writeUint16(local, dosDate);
        writeUint32(local, crc);
        writeUint32(local, contentBytes.length);
        writeUint32(local, contentBytes.length);
        writeUint16(local, nameBytes.length);
        writeUint16(local, 0);
        appendBytes(local, nameBytes);
        appendBytes(local, contentBytes);
        chunks.push(...local);

        const central = [];
        writeUint32(central, 0x02014b50);
        writeUint16(central, 20);
        writeUint16(central, 20);
        writeUint16(central, 0);
        writeUint16(central, 0);
        writeUint16(central, dosTime);
        writeUint16(central, dosDate);
        writeUint32(central, crc);
        writeUint32(central, contentBytes.length);
        writeUint32(central, contentBytes.length);
        writeUint16(central, nameBytes.length);
        writeUint16(central, 0);
        writeUint16(central, 0);
        writeUint16(central, 0);
        writeUint16(central, 0);
        writeUint32(central, 0);
        writeUint32(central, offset);
        appendBytes(central, nameBytes);
        centralDirectory.push(...central);
        offset = chunks.length;
      });

      const centralOffset = chunks.length;
      chunks.push(...centralDirectory);
      const end = [];
      writeUint32(end, 0x06054b50);
      writeUint16(end, 0);
      writeUint16(end, 0);
      writeUint16(end, files.length);
      writeUint16(end, files.length);
      writeUint32(end, centralDirectory.length);
      writeUint32(end, centralOffset);
      writeUint16(end, 0);
      chunks.push(...end);
      return new Uint8Array(chunks);
    }

    function createXlsxBlob(rows) {
      const files = [
        {
          name: "[Content_Types].xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
        },
        {
          name: "_rels/.rels",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
        },
        {
          name: "xl/workbook.xml",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Daftar Pembelian" sheetId="1" r:id="rId1"/></sheets>
</workbook>`
        },
        {
          name: "xl/_rels/workbook.xml.rels",
          content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
        },
        { name: "xl/worksheets/sheet1.xml", content: worksheetXml(rows) }
      ];
      return new Blob([createZip(files)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
    }

    function escapePdfText(value) {
      return String(value ?? "").replace(/[\\()]/g, "\\$&");
    }

    function createPdfBlob(rows) {
      const lines = rows.map(row => row.join(" | ")).slice(0, 42);
      const content = [
        "BT",
        "/F1 10 Tf",
        "12 TL",
        "40 800 Td",
        ...lines.flatMap(line => [`(${escapePdfText(line.slice(0, 135))}) Tj`, "T*"]),
        "ET"
      ].join("\n");
      const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
      ];
      let pdf = "%PDF-1.4\n";
      const offsets = [0];
      objects.forEach((obj, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
      });
      const xref = pdf.length;
      pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
      offsets.slice(1).forEach(offset => {
        pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
      });
      pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
      return new Blob([pdf], { type: "application/pdf" });
    }

    function exportFiltered(type, ids = null) {
      const data = ids
        ? invoices.filter(inv => ids.includes(inv.id))
        : getFilteredInvoices(true);
      const header = ["Nomor Transaksi", moduleLabels().contact, "Tanggal Transaksi", "Tanggal Jatuh Tempo", "Total Tagihan", "Sisa Tagihan", "Status Transaksi", "Status Pembayaran"];
      const lines = data.map(inv => [
        inv.code,
        inv.vendor,
        inv.date,
        inv.dueDate,
        totalOf(inv),
        Math.max(totalOf(inv) - paidOf(inv), 0),
        inv.transactionStatus,
        paymentStatusOf(inv)
      ]);
      const rows = [header, ...lines];
      const blob = type === "pdf" ? createPdfBlob(rows) : createXlsxBlob(rows);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const moduleName = (window.PROTOTYPE_CONFIG && window.PROTOTYPE_CONFIG.module) || "pembelian";
      link.download = type === "pdf" ? `daftar-${moduleName}.pdf` : `daftar-${moduleName}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(type === "pdf" ? "Export PDF berhasil dibuat." : "Export XLSX berhasil dibuat.");
    }

    function quickAction(label) {
      showToast(`Fitur ${label} disimulasikan di prototype.`);
    }

    function openVendorDetail(name) {
      const vendor = vendors[name] || { phone: "-", email: "-" };
      document.getElementById("vendorModalTitle").textContent = name;
      document.getElementById("vendorModalSubtitle").textContent = "Detail kontak vendor";
      document.getElementById("vendorInfoName").textContent = name;
      document.getElementById("vendorInfoPhone").textContent = vendor.phone;
      document.getElementById("vendorInfoEmail").textContent = vendor.email;
      openModal("vendorModal");
    }

    function toggleFilter(show) {
      syncFilterControls();
      document.getElementById("filterPopover").classList.toggle("show", show);
    }

    function outsideFilter(event) {
      if (event.target.id === "filterPopover") toggleFilter(false);
    }

    function applyFilter() {
      filters.paymentMethod = document.getElementById("filterPaymentMethod").value;
      filters.paymentStatus = document.getElementById("filterPaymentStatus").value;
      filters.transactionStatus = document.getElementById("filterTransactionStatus").value;
      filters.dueStatus = document.getElementById("filterDueStatus").disabled ? "all" : document.getElementById("filterDueStatus").value;
      selectedIds.clear();
      syncFilterControls();
      toggleFilter(false);
      renderList();
    }

    function resetFilter() {
      filters = {
        sources: [],
        vendors: [],
        startDate: defaultPeriodStart,
        endDate: defaultPeriodEnd,
        paymentMethod: "all",
        accounts: [],
        products: [],
        paymentStatus: "all",
        transactionStatus: "all",
        dueStatus: "all",
        creators: [],
        sortKey: "dueDate",
        sortDir: "asc"
      };
      selectedIds.clear();
      document.getElementById("searchInput").value = "";
      ["quickSourceSearch", "sourceSearch", "vendorSearch", "accountSearch", "productSearch", "creatorSearch"].forEach(id => {
        document.getElementById(id).value = "";
      });
      syncFilterControls();
      renderList();
    }

    function openModal(id) {
      document.getElementById(id).classList.add("show");
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove("show");
    }

    document.getElementById("searchInput").addEventListener("input", function() {
      selectedIds.clear();
      renderList();
    });


    function replaceVisibleText(root, pairs) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        let value = node.nodeValue;
        pairs.forEach(([from, to]) => {
          value = value.replaceAll(from, to);
        });
        node.nodeValue = value;
      });
    }

    function applyPrototypeConfig() {
      const config = window.PROTOTYPE_CONFIG || { kind: "purchase" };
      if (config.kind !== "sales") return;

      document.title = "GroApp Accounting - Tagihan Penjualan";
      const salesNames = [
        "PT Kopi Retail Indonesia",
        "CV Langganan Sejahtera",
        "Hotel Nusantara Group",
        "Kafe Sinar Pagi",
        "PT Ritel Kemasan Baru",
        "Koperasi Mitra Flores"
      ];
      const salesProducts = [
        "Kopi Susu Botol",
        "Biji Kopi Roasted Arabika",
        "Paket Coffee Beans",
        "Cold Brew Concentrate",
        "Merchandise Tumbler",
        "Kopi Drip Bag"
      ];
      const salesContacts = {
        "PT Kopi Retail Indonesia": { phone: "021-9900-1188", email: "ap@kopiretail.id" },
        "CV Langganan Sejahtera": { phone: "031-8811-7788", email: "finance@langganansejahtera.id" },
        "Hotel Nusantara Group": { phone: "022-5566-7788", email: "purchasing@hotelnusantara.id" },
        "Kafe Sinar Pagi": { phone: "0274-664-221", email: "owner@sinarpagi.id" },
        "PT Ritel Kemasan Baru": { phone: "021-8822-1199", email: "billing@ritelbaru.id" },
        "Koperasi Mitra Flores": { phone: "0380-887-221", email: "mitra@flores.id" }
      };

      Object.keys(vendors).forEach(key => delete vendors[key]);
      Object.assign(vendors, salesContacts);
      document.getElementById("vendorInput").innerHTML = salesNames.map(name => `<option>${name}</option>`).join("");
      invoices.forEach((inv, index) => {
        inv.code = inv.code.replace("PUR", "SAL");
        inv.vendor = salesNames[index % salesNames.length];
        inv.vendorRef = inv.vendorRef ? inv.vendorRef.replace("INV/VDR", "PO/CUST").replace("BKN", "SO").replace("KTF", "CUS") : "";
        inv.items = inv.items.map((item, itemIndex) => ({
          ...item,
          product: salesProducts[(index + itemIndex) % salesProducts.length],
          desc: item.desc.replace("Grade A, 25 kg", "Dus penjualan").replace("Karung", "Paket")
        }));
        inv.changes = inv.changes.map(change => change
          .replaceAll("pembelian", "penjualan")
          .replaceAll("Transaksi terbit", "Invoice terbit")
          .replaceAll("Draft", "Draft")
        );
      });

      replaceVisibleText(document.body, [
        ["Pembelian", "Penjualan"],
        ["pembelian", "penjualan"],
        ["Vendor", "Pelanggan"],
        ["vendor", "pelanggan"],
        ["Hutang", "Piutang"],
        ["hutang", "piutang"],
        ["Utang", "Piutang"],
        ["tagihan", "invoice"],
        ["Tagihan", "Invoice"]
      ]);
    }


    applyPrototypeConfig();
    restoreSidebarState();
    syncFilterControls();
    renderList();
  
