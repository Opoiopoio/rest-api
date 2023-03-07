$('form').submit(function (e) {
    e.preventDefault();

    var onForm = this
    let checkboxes = $('input[type=checkbox]')

    class ConnectionTable {
        AccountCardId
        FieldCardName
        ValueIntegerId
        ValueStringId
        constructor(checkbox) {
            this.FieldCardName = $($(checkbox).parent().parent().children()[0]).text().trim()
            let fieldCardDataType = $($(checkbox).parent().parent().children()[0]).attr('id')
            if (fieldCardDataType === 'String') {
                this.ValueStringId = $($(checkbox).parent().parent().children()[1]).attr('id')
            }
            else {
                this.ValueIntegerId = $($(checkbox).parent().parent().children()[1]).attr('id')
            }
        }
    }

    var data = []
    for (let i = 0; i < checkboxes.length; i++) {
        if ($(checkboxes[i]).prop('checked') === true) {
            let table = new ConnectionTable(checkboxes[i])
            data.push(table)
        }
    }
    if ($('#CardId').val().trim() === '' || $('#Name').val().trim() === '')
        alert('Заполните поля "Идентификатор карточки" и "Название карточки"')
    else
        if (data.length === 0) {
            openFiedCards()
            alert('Выберите поля')
        }
        else {
            var card = {
                NumberVersion: 1,
                CardId: $('#CardId').val(),
                Name: $('#Name').val(),
                DateOfCreateVersion: null,
                Status: 'Actual'
            }
            try {
                $.ajax({
                    type: $(onForm).attr('method'),
                    url: $(onForm).attr('action'),
                    data: { connectionTables: data, accountCard: card },
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