const cElem = (tagName, className, text) => {
    const elem = document.createElement(tagName);
    elem.className = className || '';
    elem.innerText = text || '';
    return elem;
}
const gElem = param => {
    const elem = document.querySelector(param);
    elem.clear = function () {
        this.innerHTML = '';
        return this;
    }
    elem.add = function (listOfElems) {
        this.append(...listOfElems);
        return this;
    }
    return elem;
}
const gElemAll = param => {
    const elem = document.querySelectorAll(param);
    elem.clear = function () {
        this.innerHTML = '';
        return this;
    }
    elem.add = function (listOfElems) {
        this.append(...listOfElems);
        return this;
    }
    return elem;
}

//Slider
const slider = () => {
    const renderBanner = item => {
        const containerSlider = cElem('div', 'banner');
        containerSlider.innerHTML = `
        <div class="banner__img-box">
            <img src="img/${item.imgUrl}" class="img-box__img" alt="slider">
            <h1 class="info__text">${item.infoFromItems.name}</h1>
        </div>
    `
        return containerSlider;
    }

    const renderSlider =  (items) => {
        const container = gElem('.slider__content');
        container.innerHTML = '';
        const elems = items.map(item => renderBanner(item))
        container.append(...elems)
    }
    renderSlider(bannersImg)

    const banner = gElemAll('.banner');
    const sliderContent = gElem('.slider__content');
    let count = 0;
    let width;

    const rollSlider = () => {
        sliderContent.style.transform = 'translate(-' + count * width + 'px)';
    }

    const init = () => {
        width = gElem('.slider__inner').offsetWidth;
        sliderContent.style.width = width * banner.length + 'px';
        banner.forEach(item => {
            item.style.width = width + 'px';
            item.style.height = 'auto';
        });
        rollSlider();
    }
    init();

    window.addEventListener('resize', init);

    gElem('.btn-next').onclick = () =>  {
        count++;
        if (count >= banner.length) count = 0;
        rollSlider();
    }

    gElem('.btn-prev').onclick = () => {
        count--;
        if (count < 0) count = banner.length - 1;
        rollSlider();
    }

    const autoSlider = () => {
        setTimeout(() => {
            count++;
            if (count >= banner.length) {
                count = 0;
                clearTimeout();
            }
            rollSlider();
            autoSlider();
        }, 50000);
    }
    autoSlider()
}
slider()

//Card
const renderItem = item => {

    const container = cElem('div', 'card');
    container.dataset.id = item.id;

    const img = cElem('img', 'card__img');
    img.src = `img/${item.imgUrl}`;

    const title = cElem('h6', 'card__title', item.name);

    const stock = cElem('div', 'card__stock');
    if (item.orderInfo.inStock === 0) {
        stock.innerHTML = `
            <svg class="stock__na-icon">
                <use href="icons/sprite.svg#closeCard"></use>
            </svg>
            <div class="stock__na-text">not available!</div>
            `
    } else {
        stock.innerHTML = `
            <svg class="stock__a-icon">
                <use href="icons/sprite.svg#checkCard"></use>
            </svg>
            <div class="stock__a-text">${item.orderInfo.inStock} left in stock</div>`
    }

    const price = cElem('p', 'card__price', `Price: ${item.price} $`);

    const addToCartBtn = cElem('button', '', 'Add to cart');
    if (item.orderInfo.inStock !== 0){
        addToCartBtn.classList.add("active-btn");
        addToCartBtn.onclick = e => {
            e.stopPropagation();
            cartInstance.addToCart(item.id)
        }
    } else {
        addToCartBtn.classList.add('not-active-btn');
    }

    const reviews = cElem('div', 'card__reviews')
    const cardViewResult = item.orderInfo.reviews <= 50 ? 'Below avarage' : 'Above avarage';
    reviews.innerHTML = `
        <div class="reviewCard">
            <svg class="likeUsers"><use href="icons/sprite.svg#likeCard"></use></svg>
            <div class="feedbackUsers">${item.orderInfo.reviews}% Positive reviews</div>
        </div>
        <div class="ratingUsers">${cardViewResult}</div>`;

    container.append(img, title, stock, price, addToCartBtn, reviews)

    if (item.orderInfo.inStock !== 0){
        container.onclick =  () => {
            renderModal(item);
        }
    }

    return container;
}
const renderCards = items => {
    const container = gElem('.card-block');
    container.innerHTML = '';
    const elems = items.map(item => renderItem(item))
    container.append(...elems)
}
renderCards(items)

const renderModal = (item) => {
    const modalsItem = items.find(device => device.id === item.id);
    const modalWindow = gElem('.modal')
    modalWindow.classList.toggle('active')
    const modalWrap = gElem(".modal__content-wrap");
    modalWrap.onclick = (e) => {
        if (e.target === modalWrap){
            modalWindow.classList.toggle('active');
        }
    }

    const modalContent = gElem('.modal__content')

    const containerModal = cElem('div', 'modal__window');

    const containerModalImg =  cElem('div', 'modal__container-img');
    const img = cElem('img', 'modal__img');
    img.src = `img/${modalsItem.imgUrl}`
    containerModalImg.append(img)

    const containerModalInfo =  cElem('div', 'modal__container-info');
    const titleModal = cElem('h6', 'modal__title', modalsItem.name);
    const reviewsModal = cElem('div', 'modal__reviews')
    const cardViewResult = modalsItem.orderInfo.reviews <= 50 ? 'Below avarage' : 'Above avarage';
    reviewsModal.innerHTML = `
        <div class="modal__container-review">
            <svg class="likeUsers"><use href="icons/sprite.svg#likeCard"></use></svg>
            <div class="feedbackUsers">${modalsItem.orderInfo.reviews}% Positive reviews</div>
        </div>
        <div class="ratingUsers">${cardViewResult}</div>`;
    const itemsParamModal = cElem('div', 'modal__param')
    const itemsColor = cElem('p', 'modal__color');
    modalsItem.color != null ? itemsColor.innerText = `Color: ${modalsItem.color}` : false;
    const itemsOS = cElem('p', 'modal__storage');
    modalsItem.os != null ? itemsOS.innerText = `Operating System: ${modalsItem.os}`: false;
    const itemsStorage = cElem('p', 'modal__storage');
    modalsItem.storage != null ? itemsStorage.innerText = `Storage: ${modalsItem.storage} gb`: false;
    const itemsDisplay = cElem('p', 'modal__storage');
    modalsItem.display != null ? itemsStorage.innerText = `Display: ${modalsItem.display} inch`: false;
    const itemsChip = cElem('p', 'modal__storage');
    if(modalsItem.chip.cores == null){
        itemsChip.innerText = `Chip: ${modalsItem.chip.name}`
    } else if (modalsItem.chip.name == null){
        itemsChip.innerText = `Chip: ${modalsItem.chip.cores}`
    }else {
        itemsChip.innerText = `Chip: ${modalsItem.chip.name+modalsItem.chip.cores}`
    }
    itemsParamModal.append(itemsColor,itemsOS, itemsStorage, itemsDisplay, itemsChip)
    containerModalInfo.append(titleModal, reviewsModal, itemsParamModal)

    const containerModalPrice =  cElem('div', 'modal__container-price');
    const price = cElem('p', 'modal__price', `${modalsItem.price} $`);
    const stock = cElem('p', 'modal__stock', `Stock: ${modalsItem.orderInfo.inStock} ptc`);
    const addToCartBtn = cElem('button', 'active-btn', 'Add to cart');
    addToCartBtn.onclick = e => {
        e.stopPropagation();
        cartInstance.addToCart(modalsItem.id)
    }
    containerModalPrice.append(price, stock, addToCartBtn)

    containerModal.append(containerModalImg, containerModalInfo, containerModalPrice)
    modalContent.clear().append(containerModal)
    return modalContent;
}

//Filter
class Utils {
    constructor() {
        this.renderItems = [...items];
        this.priceRange = this._getPriceRange();
        this.color = this._getColors();
        this.storage = this._getStorage();
        this.os = this._getOs();
        this.display = this._getDisplay()
    }

    _getPriceRange() {
        this.renderItems
            .sort((a, b) => a.price - b.price)
        return {
            from: this.renderItems[0].price,
            to: this.renderItems[this.renderItems.length - 1].price
        }
    }

    _getColors() {
        const result = []
        this.renderItems.forEach(item => {
            result.push(...item.color)
        })
        return result
            .filter((item, index, arr) => index === arr.indexOf(item))
            .sort()
    }

    _getStorage() {
        const result = []
        this.renderItems
            .sort((a, b) => a.storage - b.storage)
            .forEach(item => {
                if (item.storage !== null) result.push(item.storage)
            })
        return result
            .filter((item, index, arr) => index === arr.indexOf(item))
    }
    _getOs() {
        const result = []
        this.renderItems
            .sort((a, b) => a.os - b.os)
            .forEach(item => {
                if (item.os !== null) result.push(item.os)
            })
        return result
            .filter((item, index, arr) => index === arr.indexOf(item))
    }
    _getDisplay() {
        return ['2 - 5', '5 - 7', '7 - 12', '12 - 16', '+16']
    }
}
const utils = new Utils()

class Filter extends Utils{
    constructor() {
        super();
        this.filterArr = [
            {
                type: 'range',
                title: 'price',
                variant: utils.priceRange,
                changes: {...this.priceRange},
            },
            {
                type: 'check',
                title: 'color',
                variants: this.color,
                checked: [],
            },
            {
                type: 'check',
                title: 'storage',
                variants: this.storage,
                checked: [],
            },
            {   type: 'check',
                title: 'os',
                variants: this.os,
                checked: [],
            },
            {
                type: 'check',
                title: 'display',
                variants: this.display,
                checked: [],
            },
        ]
    }

    getChangePrice = (type, price) => {
        this.filterArr[0].changes[type] = price;
        optionsFilter.allFilter();
    }

    getChangesCategory = (index, categoryName) => {
        const indexOfChangeCategory = this.filterArr[index].checked.indexOf(categoryName);
        indexOfChangeCategory > -1 ? this.filterArr[index].checked.splice(indexOfChangeCategory)
            : this.filterArr[index].checked.push(categoryName);
        optionsFilter.allFilter();
    }
}
const filter = new Filter;

class RenderFilter extends Filter{
    constructor() {
        super();
        this.renderFilters()
    }

    get contentRenderMethods() {
        return {
            check: this._renderContentCheck.bind(this),
            range: this._renderContentRange.bind(this),
        }
    }

    renderFilters(){
        const container = gElem('.filter-container');
        const elems = this.filterArr.map(item => this._renderTitleCategory(item));
        container.innerHTML = '';
        container.append(...elems);
    }

    _renderTitleCategory(item) {
        const container = cElem('div', 'filter-item');

        const title = cElem('div', 'filter-item__item-title');
        title.innerHTML = `
                   <span>${item.title[0].toUpperCase() + item.title.slice(1)}</span>
                   <div class="arrow"></div>
        `;

        title.onclick = function () {
                this.parentElement.classList.toggle("aside-filters__active");
                const panel = this.nextSibling;
                panel.style.maxHeight ? panel.style.maxHeight = null : panel.style.maxHeight = panel.scrollHeight + "px";
        };

        const content = cElem('div', 'filter-item__item-content');
        const secondContent = cElem('div', 'filter-item__item-content-wrap' )

        const getContent = this.contentRenderMethods[item.type];

        const filterContent = getContent(item);
        secondContent.append(...filterContent)

        content.append(secondContent);
        container.append(title, content);
        container.append(title, content);
        return container;
    }

    _renderContentCheck(item) {
        return item.variants.map( variant => {
            const label = cElem('label', 'checkbox-container');
            const title = cElem('span', 'span', variant);
            item.title === 'storage' ? title.innerText = title.innerText +' Gb' : false
            item.title === 'display' ? title.innerText = title.innerText + ' inch' : false
            const inp = cElem('input');
            inp.classList.add(`${item.title}`)
            inp.type = 'checkbox';
            inp.value = variant;
            label.append(inp, title);
            return label;
        })
    }

    _renderContentRange(item) {
        const containerFrom = cElem('div', 'range-text');
        const labelFrom = cElem('label');
        labelFrom.innerText = 'From'
        const inputFrom = cElem('input');
        inputFrom.value = item.variant.from
        containerFrom.append(labelFrom, inputFrom)

        const containerTo = cElem('div', 'range-text');
        const labelTO = cElem('label');
        labelTO.innerText = 'To'
        const inputTo = cElem('input');
        inputTo.value = item.variant.to
        containerTo.append(labelTO, inputTo)

        inputFrom.onchange = (e) => {
            let value =  +e.target.value
            if (value < item.variant.from || value > item.variant.to || isNaN(value)) {
                e.target.value = item.variant.from
            } else {
                optionsFilter.getChangePrice('from', value);
            }
        }

        inputTo.onchange = (e) => {
            let value = +e.target.value
            if (value > item.variant.to || value < item.variant.from || isNaN(value)) {
                e.target.value = item.variant.to
            } else {
                optionsFilter.getChangePrice('to', value);
            }
        }
        return [containerFrom, containerTo]
    }
}
const renderFilter = new RenderFilter();

class OptionsFilter extends Filter {
    constructor() {
        super();
        this.config = {
            searchVal: '',
            sortVal: '',
        }
        this.allFilter = () => {
            this.filteredCards = [...items];
            this.startFilter();
            this.sortItems();
            renderCards(this.filteredCards);
        }
    }

    startFilter() {
        this.filteredCards = this.filteredCards.filter(item => {
            const name = item.name.toLowerCase();
            const isName = name.includes(this.config.searchVal);
            const isPrice = item.price >= this.filterArr[0].changes.from && item.price <= this.filterArr[0].changes.to
            const isColor = this.filterArr[1].checked.length < 1  ||
                item.color.some(color => this.filterArr[1].checked.includes(color))
            const isStorage = this.filterArr[2].checked.length < 1 ||
                this.filterArr[2].checked.includes(item.storage)
            const isOs = this.filterArr[3].checked.length < 1 ||
                this.filterArr[3].checked.includes(item.os)
            const displayRange = this.filterArr[4].checked.map(range => {
                return (range === '+16') ?  [16, 1000] : range.split(' ').filter(num => !isNaN(num));
            })
            const isDisplay = this.filterArr[4].checked.length < 1 || (item.display !== null) &&
                displayRange.some(element => +element[0] <= item.display && +element[1] >= item.display)
            return isName && isPrice && isColor && isStorage &&isOs && isDisplay;
        })
    }

    sortItems(value = this.config.sortVal){
        if (value === 'def') return;
        this.filteredCards.sort(  (a,b) => {
            if (value === 'asc') return b.price-a.price;
            if (value === 'desc') return a.price-b.price;
        })
    }
}
const optionsFilter = new OptionsFilter()

class EventsFilter extends Filter{
    constructor() {
        super();
        this.getChangeName()
        this.getChangeSettPrice()
        this.getChangeColor()
        this.getChangeStorage()
        this.getChangeOs()
        this.getChangeDisplay()
    }
    getChangeName(){
        const changeName = gElem('.search__inp');
        changeName.oninput = (e) => {
            optionsFilter.config.searchVal = e.target.value.toLowerCase();
            optionsFilter.allFilter();
        };
    }
    getChangeSettPrice(){
        const changePrice = gElem('.search__sett-price-block');
        changePrice.onchange = (e) => {
            optionsFilter.config.sortVal = e.target.value;
            optionsFilter.allFilter();
        };
    }
    getChangeColor(){
        const changeColor = gElemAll('.color');
        changeColor.forEach(item => {
            item.oninput = (e) => {
                const value = e.target.value;
                optionsFilter.getChangesCategory( 1, value);
            }
        });
    }
    getChangeStorage(){
        const changeStorage = gElemAll('.storage');
        changeStorage.forEach(item => {
            item.oninput = (e) => {
                const value = +e.target.value;
                optionsFilter.getChangesCategory( 2, value);
            }
        });
    }
    getChangeOs(){
        const changeOs = gElemAll('.os');
        changeOs.forEach(item => {
            item.oninput = (e) => {
                const value = e.target.value;
                optionsFilter.getChangesCategory( 3, value);
            }
        });
    }
    getChangeDisplay(){
        const changeDisplay = gElemAll('.display');
        changeDisplay.forEach(item => {
            item.oninput = (e) => {
                const value = e.target.value;
                optionsFilter.getChangesCategory( 4, value);
            }
        });
    }
}
const eventsFilter = new EventsFilter

//Cart
class Cart {
    constructor() {
        this.items = [];
        this.totalCount = 0;
        this.totalPrice = 0;
        this._getFRomLS();
    }

    _getFRomLS() {
        const cartAsJson = localStorage.getItem('cart');
        if (cartAsJson !== null) {
            const cart = JSON.parse(cartAsJson);
            Object.assign(this, cart);
        }
    }

    _setCartToLS() {
        const cartAsJson = JSON.stringify(this);
        localStorage.setItem('cart', cartAsJson);
    }

    addToCart(id, count = 0){
        const currentItem = items.find(item => item.id === id);
        const objInItems = this.items.find(item => item.id === id);
        if (count < 4){
            if (!objInItems) {
                this.items.push({id, count: 1, price: currentItem.price})
            } else {
                objInItems.count++;
                objInItems.price += currentItem.price
            }
        }
        this._reAmountTotalProperties();
    }

    removeItemFromCart(id) {
        const indexOfItem = this.items.findIndex(item => item.id === id);
        this.items.splice(indexOfItem, 1);
        this._reAmountTotalProperties();
    }

    removeFromCart(id, count){
        const currentItem = items.find(item => item.id === id);
        const indexOfItem = this.items.findIndex(item => item.id === id);
        if (count > 1) {
            this.items[indexOfItem].count--;
            this.items[indexOfItem].price -= currentItem.price;
        }
        this._reAmountTotalProperties();
    }

    _reAmountTotalProperties() {
        const initAccumulator = {
            totalCount: 0,
            totalPrice: 0
        }
        const totalAmountResult = this.items.reduce((accum, item) => {
            const currentItem = items.find(gadget => gadget.id === item.id);
            return {
                totalCount: accum.totalCount + item.count,
                totalPrice: accum.totalPrice + currentItem.price * item.count,
            }
        }, initAccumulator)

        Object.assign(this, totalAmountResult);
        this._setCartToLS()
        renderCartInstance.renderContent();
        renderCartInstance._renderModalContent();
        renderCartInstance._renderTotalInfo();
    }
}
const cartInstance = new Cart();

class RenderCart {
    constructor() {
        this.renderContent();
        this.renderModal();
    }

    renderModal(){
        const cart = gElem('.cart__box');
        const cartItemsModal = gElem('.cart-content');

        cart.onclick = () => {
            const isShowModal = cartItemsModal.classList.toggle('active')
            if (isShowModal) {
                this._renderModalContent();
                this._renderTotalInfo();
            }
        }
    }

    renderContent() {
        const cartInfoElem = gElem('.cart__quantity-item');
        cartInfoElem.innerText = `${cartInstance.totalCount}`
    }

    _renderModalContent(){
        const itemsFromCart = cartInstance.items;
        const itemsForRender = [];

        items.forEach(gadget => {
            const itemFromCart = itemsFromCart.find(item => item.id === gadget.id);
            if (itemFromCart) {
                itemsForRender.push({
                    data: gadget,
                    count: itemFromCart.count,
                    totalPrice: itemFromCart.price,
                })
            }
        })

        const cartContent = gElem('.cart-content');
        cartContent.innerHTML = '';

        const contentTitle = cElem('div', 'cart-content__title')
        contentTitle.innerHTML = `
            <span>Shopping Cart</span>
            <span>Checkout is almost done!</span>
        `
        cartContent.appendChild(contentTitle)

        const cartCard = cElem('div', 'cart-content__list-box')

        itemsForRender.forEach(item => {
            let cartBtnLeft;
            let cartBtnRight;
            item.count > 1 ? (cartBtnLeft = "cart-content__button-left") : (cartBtnLeft = "cart-content__button-dis");
            item.count < 4 ? (cartBtnRight = "cart-content__button-right") : (cartBtnRight = "cart-content__button-dis");

            const container = cElem('div', 'cart-content__list');

            const itemBlock = cElem('div', 'cart-content__item');

            const img = cElem('img', 'cart-content__img')
            img.src = `img/${item.data.imgUrl}`;

            const textItem = cElem('div', 'cart-content__text');
            const hItem = cElem('h3', 'cart-content__device-name', item.data.name);
            const spanItem = cElem('span', 'cart-content__price', item.totalPrice)

            const quantityItem = cElem('div', 'cart-content__quantity');

            const cartMinusBtn = cElem("button", cartBtnLeft, "<");
            cartMinusBtn.id = item.data.id;
            cartMinusBtn.count = item.count;
            cartMinusBtn.onclick = (e) => {
                const cartId = +e.currentTarget.id;
                const cartCount = +e.currentTarget.count;
                cartInstance.removeFromCart(cartId, cartCount);
            };

            const cartItemCount = cElem('span', 'spanCount', item.count);

            const cartPlusBtn = cElem("button", cartBtnRight, ">");
            cartPlusBtn.id = item.data.id;
            cartPlusBtn.count = item.count;
            cartPlusBtn.onclick = (e) => {
                const cartId = +e.currentTarget.id;
                const cartCount = +e.currentTarget.count;
                cartInstance.addToCart(cartId, cartCount);
            };

            const cartCloseBtn = cElem('button', 'cart-content__delete', 'x');
            cartCloseBtn.id = item.data.id;
            cartCloseBtn.onclick = (e) => {
                const cartId = +e.currentTarget.id;
                cartInstance.removeItemFromCart(cartId);
            };

            textItem.append(hItem, spanItem)
            itemBlock.append(img, textItem, quantityItem, cartCloseBtn)
            container.append(itemBlock)
            cartCard.appendChild(container)

            quantityItem.append(cartMinusBtn, cartItemCount, cartPlusBtn)
        })

        if (!cartInstance.items.length){
            cartCard.innerHTML = `<p class="cart-content__empty">Cart is empty...</p>`
        }

        cartContent.append(cartCard)
    }

    _renderTotalInfo() {
        if (cartInstance.items.length){
            const cartContent = gElem('.cart-content')
            const contentBottom = cElem('div', 'cart-content__bottom')
            contentBottom.innerHTML=`
                 <div class="cart-content__fullprice">
                    <div> 
                        <span>Total amount:</span>
                        <span class="full">${cartInstance.totalCount} ptc.</span>
                    </div>
                   <div>
                       <span>Total price:</span>
                       <span class="full">${cartInstance.totalPrice}$</span>
                   </div>
                </div>
                <button>Buy</button>
            `
            cartContent.append(contentBottom)
        }
    }
}
const renderCartInstance = new RenderCart();

const openAndCloseSettPrise = () =>{
    const searchSettPriceBlock = gElem('.search__sett-price-block')

    gElem('.search__sett-price').onclick = e => {
        e.stopPropagation();
        searchSettPriceBlock.classList.toggle('active')
    }

    document.onclick = () => {
        searchSettPriceBlock.classList.contains('active') ? searchSettPriceBlock.classList.toggle('active') : false
    }
}
openAndCloseSettPrise()
