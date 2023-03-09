
$('form').submit(function (e) {
    e.preventDefault();

    var onForm = this

    class FieldCard {
        Name
        DataType
        constructor(id) {
            this.Name = $('input#fieldCardName')[id].value
        }
    }
    class Value {
        Value
        constructor(id) {
            this.Value = $('input#cardValue')[id].value
        }
    }

    var dataValue = []
    var dataField = []
    let confirm = false
    formFloating = $('div.scroll div.form-floating')
    for (let i = 0; i < formFloating.length / 2; i++) {
        let value = new Value(i)
        let field = new FieldCard(i)
        if (value.Value === '' || field.Name === '') {
            confirm = true
            break
        }
        else {
            dataValue.push(value)
            dataField.push(field)
        }
    }
    if ($('#CardId').val().trim() === '' || $('#Name').val().trim() === '')
        alert('Заполните поля "Идентификатор карточки" и "Название карточки"')
    else
        if (confirm) {
            alert('Заполните поля')
        }
        else {
            var card = {
                NumberVersion: null,
                CardId: $('#CardId').val(),
                Name: $('#Name').val(),
                DateOfCreateVersion: null,
                Status: 'Actual'
            }
            try {
                $.ajax({
                    type: $(onForm).attr('method'),
                    url: $(onForm).attr('action'),
                    data: { accountCard: card, fieldCard: dataField, fieldCardValue: dataValue },
                    dataType: 'json',
                    success: function (response) {
                        alert(response.message)
                    }
                });
            }
            catch (error) {
                console.error('Error:', error);
            }
        }
});

$(document).on('click', '.filling', closeFieldCards)

$('.btn-close').click(closeFieldCards)

function closeFieldCards() {
    $('.field-card-container').css('display', 'none')
    $('.filling').remove()
}

$('tr').click(function () {
    $($(this).children()[2]).children().prop('checked', !$($(this).children()[2]).children().prop('checked'))
});

$('#openFieldCards').click(openFiedCards)

$('#openFieldCardsDeduplicated').click(function () {
    $('#deduplication').css('display', 'block')
    let filling = document.createElement('div')
    filling.className = 'filling'
    $('#deduplication').after(filling)
})

function openFiedCards() {
    $('#duplication').css('display', 'block')
    let filling = document.createElement('div')
    filling.className = 'filling'
    $('#duplication').after(filling)
}

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

$('#delete').click(function () {
    if ($('.form-floating').length > 5) {
        $('.form-floating').last().remove()
        $('.form-floating').last().remove()
    }
})