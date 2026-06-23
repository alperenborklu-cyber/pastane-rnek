// Pastane Ürün Veri Tabanı
const products = [
    {
        id: 1,
        name: "Altın Yaprak Çikolatalı Pasta",
        category: "pastalar",
        description: "Belçika çikolatalı mousse, çıtır feuilletine dolgusu ve üzeri yenilebilir altın yaprak işlemeli lüks el yapımı pasta.",
        price: 850,
        image: "images/hero.png",
        badge: "Şefin İmzası",
        options: ["4-6 Kişilik", "8-10 Kişilik (+400 TL)", "12-15 Kişilik (+800 TL)"]
    },
    {
        id: 2,
        name: "Altınbaşak Premium Macaron Seti",
        category: "kurabiyeler",
        description: "Antep fıstıklı, Madagaskar vanilyalı, karamelli ve ahududulu taze el yapımı özel 12'li premium makaron kutusu.",
        price: 480,
        image: "images/macarons.png",
        badge: "Çok Satan",
        options: ["12'li Kutu", "24'lü Kutu (+400 TL)"]
    },
    {
        id: 3,
        name: "Saray Usulü Fıstıklı Baklava",
        category: "tatlilar",
        description: "40 kat incecik el açması hamur, sade yağ ve bol Antep fıstığının fırından çıkan sıcak şerbetle eşsiz buluşması.",
        price: 720,
        image: "images/baklava.png",
        badge: "Geleneksel",
        options: ["0.5 Kg", "1 Kg (+650 TL)", "2 Kg (+1900 TL)"]
    },
    {
        id: 4,
        name: "Çilekli & Mascarpone Tart",
        category: "pastalar",
        description: "Çıtır tart hamuru üzerinde hafif mascarpone kreması ve taze dağ çilekleri ile süslenmiş yaz esintisi.",
        price: 590,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
        badge: "Yeni",
        options: ["Tek Kişilik", "4-6 Kişilik (+350 TL)"]
    },
    {
        id: 5,
        name: "Tuzlu Karamel & Fıstıklı Ekler",
        category: "pastalar",
        description: "Özel şu hamuru içerisinde karamelli krema, üzerinde kavrulmuş Antep fıstığı ve deniz tuzu tanecikleri.",
        price: 95,
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600&auto=format&fit=crop",
        badge: "Popüler",
        options: ["Adet"]
    },
    {
        id: 6,
        name: "Tereyağlı Kruvasan & Çikolata Dolgulu",
        category: "unlu-mamuller",
        description: "Fransız tereyağı ile 3 gün boyunca katlandırılmış, dışı çıtır içi yumuşacık ve akışkan çikolatalı kruvasan.",
        price: 110,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop",
        badge: "Taze Çıktı",
        options: ["Adet", "3'lü Paket (+180 TL)", "6'lı Aile Paketi (+450 TL)"]
    },
    {
        id: 7,
        name: "Antep Fıstıklı Makaron Rüyası",
        category: "kurabiyeler",
        description: "Tamamen el yapımı, içi nefis Antep fıstığı ezmeli krema dolgulu özel tekli büyük boy makaron.",
        price: 75,
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=600&auto=format&fit=crop",
        badge: "Hafif Tatlar",
        options: ["Adet", "5'li Paket (+280 TL)"]
    },
    {
        id: 8,
        name: "Lüks Dereotlu & Peynirli Poğaça",
        category: "unlu-mamuller",
        description: "Hakiki Ezine peyniri ve taze kıyılmış dereotu ile hazırlanan ağızda dağılan tuzlu atıştırmalık.",
        price: 45,
        image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop",
        badge: "Tuzlular",
        options: ["Adet", "10'lu Paket (+350 TL)"]
    }
];

// Uygulama Durumu (State)
let cart = JSON.parse(localStorage.getItem('pastane_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';
let selectedProduct = null;
let selectedOptionIndex = 0;

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    setupHeaderScroll();
}

// Header kaydırma efekti
function setupHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Dinamik Ürün Listeleme
function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const filtered = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 40px;">Aradığınız kriterlere uygun ürün bulunamadı.</div>`;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper" onclick="openProductModal(${product.id})">
                <img src="${product.image}" class="product-img" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer;">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price} TL</span>
                    <button class="add-to-cart-btn" onclick="openProductModal(${product.id})" aria-label="Seçenekleri Gör ve Sepete Ekle">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal İşlemleri
window.openProductModal = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    selectedProduct = product;
    selectedOptionIndex = 0;

    const modalOverlay = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-product-img');
    const modalTitle = document.getElementById('modal-product-title');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalOptions = document.getElementById('modal-product-options');
    const modalPrice = document.getElementById('modal-product-price');

    modalImage.src = product.image;
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.description;

    // Seçenekleri oluştur
    modalOptions.innerHTML = '';
    product.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${idx === 0 ? 'selected' : ''}`;
        btn.textContent = opt;
        btn.onclick = () => selectOption(idx);
        modalOptions.appendChild(btn);
    });

    updateModalPrice();

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeProductModal = function() {
    const modalOverlay = document.getElementById('product-modal');
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
};

function selectOption(index) {
    selectedOptionIndex = index;
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    updateModalPrice();
}

function updateModalPrice() {
    if (!selectedProduct) return;
    const basePrice = selectedProduct.price;
    const optionStr = selectedProduct.options[selectedOptionIndex];
    
    // Fiyat artışını tespit etme (+XXX TL)
    let addedPrice = 0;
    const match = optionStr.match(/\+(\d+)\s*TL/);
    if (match) {
        addedPrice = parseInt(match[1]);
    }
    
    const totalPrice = basePrice + addedPrice;
    document.getElementById('modal-product-price').textContent = `${totalPrice} TL`;
}

// Sepet İşlemleri
window.addToCartFromModal = function() {
    if (!selectedProduct) return;

    const basePrice = selectedProduct.price;
    const optionStr = selectedProduct.options[selectedOptionIndex];
    let addedPrice = 0;
    const match = optionStr.match(/\+(\d+)\s*TL/);
    if (match) {
        addedPrice = parseInt(match[1]);
    }
    const finalPrice = basePrice + addedPrice;

    // Sepette aynı üründen aynı seçenekte var mı kontrol et
    const existingIndex = cart.findIndex(item => item.id === selectedProduct.id && item.option === optionStr);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: selectedProduct.id,
            name: selectedProduct.name,
            image: selectedProduct.image,
            option: optionStr,
            price: finalPrice,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    closeProductModal();
    showToast(`${selectedProduct.name} sepetinize eklendi.`);
    toggleCartDrawer(true);
};

function saveCart() {
    localStorage.setItem('pastane_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const itemsContainer = document.getElementById('cart-items-container');
    const totalAmountSpan = document.getElementById('cart-total-amount');
    const countBadge = document.getElementById('cart-count');

    if (!itemsContainer || !totalAmountSpan || !countBadge) return;

    itemsContainer.innerHTML = '';

    let total = 0;
    let totalItemsCount = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<div class="cart-empty-msg">Sepetinizde ürün bulunmamaktadır.</div>`;
        document.getElementById('checkout-form').classList.remove('active');
        document.getElementById('checkout-action-btn').textContent = "Sepet Boş";
        document.getElementById('checkout-action-btn').disabled = true;
    } else {
        document.getElementById('checkout-action-btn').disabled = false;
        document.getElementById('checkout-action-btn').textContent = "Sipariş Bilgilerini Gir";
        
        cart.forEach((item, idx) => {
            total += item.price * item.quantity;
            totalItemsCount += item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-variant">${item.option}</div>
                    <div class="cart-item-price">${item.price} TL</div>
                    <div class="cart-item-quantity-ctrl">
                        <button class="qty-btn" onclick="updateQty(${idx}, -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${idx}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${idx})" aria-label="Ürünü Çıkar">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }

    totalAmountSpan.textContent = `${total} TL`;
    countBadge.textContent = totalItemsCount;
}

window.updateQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
};

window.removeCartItem = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    showToast("Ürün sepetten çıkarıldı.");
};

window.toggleCartDrawer = function(forceState = null) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (forceState === true) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    } else if (forceState === false) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    }
};

// Checkout ve WhatsApp Sipariş Oluşturma
window.handleCheckoutClick = function() {
    const formContainer = document.getElementById('checkout-form');
    const btn = document.getElementById('checkout-action-btn');

    if (!formContainer.classList.contains('active')) {
        // Formu aç
        formContainer.classList.add('active');
        btn.textContent = "WhatsApp ile Siparişi Tamamla";
        // Form alanına odaklan
        document.getElementById('order-name').focus();
    } else {
        // Siparişi gönder
        submitOrder();
    }
};

function submitOrder() {
    const name = document.getElementById('order-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const note = document.getElementById('order-note').value.trim();

    if (!name || !phone || !address) {
        showToast("Lütfen isim, telefon ve adres alanlarını doldurunuz.");
        return;
    }

    // Sipariş Mesajı Şablonu
    let message = `*Altınbaşak & Liva Premium Pastacılık - Yeni Sipariş*\n\n`;
    message += `*Müşteri Bilgileri:*\n`;
    message += `👤 İsim: ${name}\n`;
    message += `📞 Telefon: ${phone}\n`;
    message += `📍 Adres: ${address}\n`;
    if (note) {
        message += `✍️ Not: ${note}\n`;
    }
    message += `\n*Sipariş Detayları:*\n`;

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `- ${item.name} (${item.option}) x ${item.quantity} adet = ${itemTotal} TL\n`;
    });

    message += `\n*Toplam Tutar: ${total} TL*`;

    // WhatsApp API URL'i
    // Pastanenin telefon numarası buraya girilir, örnek numara: 905551234567
    const shopPhoneNumber = "905551234567"; 
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${shopPhoneNumber}&text=${encodedMessage}`;

    // Sepeti temizle ve yönlendir
    cart = [];
    saveCart();
    updateCartUI();
    toggleCartDrawer(false);
    showToast("Siparişiniz hazırlanıyor, WhatsApp'a yönlendiriliyorsunuz...");

    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1500);
}

// Event Listeners ve Genel Ayarlar
function setupEventListeners() {
    // Kategori butonları geçişi
    const categoryBtns = document.querySelectorAll('.category-tab-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activeCategory = e.currentTarget.dataset.category;
            renderProducts();
        });
    });

    // Arama Çubuğu
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            // Menü simgesi animasyonu
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = navMenu.classList.contains('open') ? 'rotate(45deg) translate(6px, 6px)' : '';
            spans[1].style.opacity = navMenu.classList.contains('open') ? '0' : '1';
            spans[2].style.transform = navMenu.classList.contains('open') ? 'rotate(-45deg) translate(4px, -5px)' : '';
        });
    }

    // Menü bağlantılarına tıklandığında menüyü kapatma (mobil için)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                mobileToggle.click();
            }
        });
    });
}

// Toast Bildirimi Göster
function showToast(text) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--color-gold);"></i> <span>${text}</span>`;
    
    container.appendChild(toast);
    
    // Animasyonu başlat
    setTimeout(() => toast.classList.add('show'), 10);

    // 3 saniye sonra kaldır
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
