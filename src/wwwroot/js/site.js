function createElement(fieldNewElement) {
    let element = document.createElement(fieldNewElement.tag)
    if (fieldNewElement.class != undefined) element.className = fieldNewElement.class;
    if (fieldNewElement.id != undefined) element.id = fieldNewElement.id;
    if (fieldNewElement.text != undefined) element.textContent = fieldNewElement.text;
    if (fieldNewElement.type != undefined) element.type = fieldNewElement.type;
    if (fieldNewElement.placeholder != undefined) element.placeholder = fieldNewElement.placeholder
    if (fieldNewElement.autocomplete != undefined) element.autocomplete = fieldNewElement.autocomplete
    if (fieldNewElement.for != undefined) element.for = fieldNewElement.for
    return element
}

function createFieldCardName(formFloatingFieldCardName) {
    let formControl = createElement({
        tag: 'input',
        class: 'form-control',
        id: 'fieldCardName',
        placeholder: 'Название поля карточки',
        autocomplete: "off"
    })
    let label = createElement({
        tag: 'label',
        class: 'control-label',
        for: 'fieldCardName',
        text: 'Название поля карточки'
    })
    formFloatingFieldCardName.append(formControl)
    formFloatingFieldCardName.append(label)
}

function createFieldCardValue(formFloatingFieldCardName) {
    let formControl = createElement({
        tag: 'input',
        class: 'form-control',
        id: 'cardValue',
        placeholder: 'Значение поля карточки',
        autocomplete: "off"
    })
    let label = createElement({
        tag: 'label',
        class: 'control-label',
        for: 'cardValue',
        text: 'Значение поля карточки'
    })
    formFloatingFieldCardName.append(formControl)
    formFloatingFieldCardName.append(label)
}

$('#add').click(function () {
    let formFloatingFieldCardName = createElement({ tag: 'div', class: 'form-floating mb-3' })
    createFieldCardName(formFloatingFieldCardName)
    let formFloatingFieldCardValue = createElement({ tag: 'div', class: 'form-floating mb-3' })
    createFieldCardValue(formFloatingFieldCardValue)
    $(this).parent().before(formFloatingFieldCardName);
    $(this).parent().before(formFloatingFieldCardValue);
})
const formFloatingCount = $('.form-floating').length
$('#delete').click(function () {
    if ($('.form-floating').length > formFloatingCount) {
        $('.form-floating').last().remove()
        $('.form-floating').last().remove()
    }
})