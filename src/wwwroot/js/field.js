$(document).on('click', '#sendPatch', function (e) {
    e.preventDefault();
    function getData(id) {
        let stringId = $(id).text()
        let returnId = stringId.slice(stringId.indexOf(': ') + 2, stringId.length).trim()
        return returnId
    }

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

    let card = {
        NumberVersion: getData('#cardVersion'),
        CardId: getData('#idCard'),
        DateOfCreateVersion: null,
        Name: $('#name').val(),
        Status: 'Actual'
    }
    if (card.Name === '') alert('Введите название карточки')
    else $.ajax({
        type: "POST",
        url: "/api/card/patch",
        data: {
            accountCard: card, fieldCard: dataField, fieldCardValue: dataValue
        },
        dataType: "json",
        success: function (response) {
            alert(response.message)
        }
    });
});

$('#patch').click(function (e) {
    e.preventDefault();

    $('#data-container').empty();

    let inputGroupName = createElement({ tag: 'div', class: 'input-group mb-3 mt-3' })
    generateInputGroup(inputGroupName, 'Название карточки', 'name')

    let sendButton = createElement({ tag: 'button', class: 'btn btn-primary', id: 'sendPatch', text: 'Отправить' })

    $(this).remove();
    $('.scroll').prop('hidden', false)
    $('#data-container').append(inputGroupName);
    $('#data-container').append(sendButton);
})

function generateInputGroup(inputGroup, nameText, idInput) {
    let inputGroupPrepend = createElement({ tag: 'div', class: 'input-group-prepend' })
    inputGroup.append(inputGroupPrepend);

    let inputGroupText = createElement({ tag: 'span', class: 'input-group-text', id: 'basic-addon3', text: nameText })
    inputGroupPrepend.append(inputGroupText);

    let input = createElement({ tag: 'input', class: 'form-control', id: idInput })
    $(inputGroup).append(input);
    $(input).attr('aria-describedby', 'basic-addon3');
}
