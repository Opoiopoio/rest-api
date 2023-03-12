$('form').submit(
    function (e) {
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
                    Status: 'Actual'
                }
                try {
                    $.ajax({
                        type: $(onForm).attr('method'),
                        url: $(onForm).attr('action'),
                        data: { accountCard: card, fieldCard: dataField, fieldCardValue: dataValue },
                        dataType: 'json',
                        success: function (response) {
                            if (typeof (response.message) === 'string')
                                alert(response.message)
                            else {
                                validateField(response.message)
                            }
                        }
                    });
                }
                catch (error) {
                    console.error('Error:', error);
                }
            }
    })


$(document).on('click', '.filling', closeFieldCards)

$('.btn-close').click(closeFieldCards)

function closeFieldCards() {
    $('.field-card-container').css('display', 'none')
    $('.filling').remove()
}


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

$('form').validate({
    // этот класс применяетсья для правильно заполненого поля
    validClass: "w3-border-green w3-pale-green",
    errorClass: "is-invalid text-danger", // противоположный

    wrapper: 'div', // во что обарачивать ошибки
    rules: {
        CardId: {
            required: true,
            number: true
        },
        Name: {
            required: true
        }
    },
    messages: {
        CardId: {
            required: 'Заполните поле идентификатор карточки',
            number: 'Введите число'
        },
        Name: {
            required: 'Заполните поле название карточки'
        }
    },

    invalidHandler: function (event, validator) {
        event.preventDefault()
        // 'this' refers to the form
        alert('Исправьте ошибки')

    }
})