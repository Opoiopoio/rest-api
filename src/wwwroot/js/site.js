function createElement(fieldNewElement) {
    let element = document.createElement(fieldNewElement.tag)
    if (fieldNewElement.class != undefined) element.className = fieldNewElement.class;
    if (fieldNewElement.id != undefined) element.id = fieldNewElement.id;
    if (fieldNewElement.text != undefined) element.textContent = fieldNewElement.text;
    if (fieldNewElement.type != undefined) element.type = fieldNewElement.type;
    if (fieldNewElement.placeholder != undefined) element.placeholder = fieldNewElement.placeholder
    if (fieldNewElement.autocomplete != undefined) element.autocomplete = fieldNewElement.autocomplete
    if (fieldNewElement.for != undefined) $(element).attr('for', fieldNewElement.for)
    if (fieldNewElement.value != undefined) element.value = fieldNewElement.value
    return element
}

function createFieldCardName(formFloatingFieldCardName) {
    formFloatingFieldCardName.append(
        createElement({
            tag: 'input',
            class: 'form-control',
            id: 'fieldCardName',
            placeholder: 'Название поля карточки',
            autocomplete: "off"
        }))
    formFloatingFieldCardName.append(
        createElement({
            tag: 'label',
            class: 'control-label',
            for: 'fieldCardName',
            text: 'Название поля карточки'
        }))
    formFloatingFieldCardName.append(
        createElement({
            tag: 'span',
            class: 'text-danger',
            for: 'fieldCardName',
        }))
}

function createFieldCardValue(formFloatingFieldCardName) {
    formFloatingFieldCardName.append(
        createElement({
            tag: 'input',
            class: 'form-control',
            id: 'cardValue',
            placeholder: 'Значение поля карточки',
            autocomplete: "off"
        }))
    formFloatingFieldCardName.append(
        createElement({
            tag: 'label',
            class: 'control-label',
            for: 'cardValue',
            text: 'Значение поля карточки'
        }))
    formFloatingFieldCardName.append(
        createElement({
            tag: 'span',
            class: 'text-danger',
            for: 'cardValue',
        }))
}

$('#add').click(function () {
    let fieldContainer = createElement({ tag: 'div', class: 'field-container' })

    let formFloatingFieldCardName = createElement({ tag: 'div', class: 'form-floating mb-3' })
    createFieldCardName(formFloatingFieldCardName)
    fieldContainer.append(formFloatingFieldCardName)

    let formFloatingFieldCardValue = createElement({ tag: 'div', class: 'form-floating mb-3' })
    createFieldCardValue(formFloatingFieldCardValue)
    fieldContainer.append(formFloatingFieldCardValue)

    $('div#field-container div.scroll').append(fieldContainer);
})
const formFloatingCount = $('.form-floating').length
$('#delete').click(function () {
    if ($('.form-floating').length > formFloatingCount) {
        $('.form-floating').last().remove()
        $('.form-floating').last().remove()
    }
})

function validateField(message) {
    message.forEach(function (validate) {
        $('div#field-container div.scroll input#fieldCardName').eq(validate.Id).addClass('is-invalid')
        $('div#field-container div.scroll input#cardValue').eq(validate.Id).addClass('is-invalid')
        $('div#field-container div.scroll span[for = fieldCardName]').eq(validate.Id).text(validate.Message)
        $('div#field-container div.scroll span[for = cardValue]').eq(validate.Id).text(validate.Message)
    })
}
$(document).on('input', '.is-invalid', function () {
    $(this).parent().parent().children('div').children('.is-invalid').removeClass('is-invalid')
    $(this).parent().parent().children('div').children('span').text('')
})