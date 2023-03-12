$(document).on('click', '#sendPatch', function (e) {
    e.preventDefault();
    function getData(id) {
        let stringId = $(id).text()
        let returnId = stringId.slice(stringId.indexOf(': ') + 2, stringId.length).trim()
        return returnId
    }

    class ConnectionTable {
        AccountCardId
        FieldCardName
        ValueIntegerId
        ValueStringId
        constructor(tr) {
            this.FieldCardName = $($(tr).children()[0]).text().trim()
            let fieldCardDataType = $($(tr).children()[0]).attr('id')
            if (fieldCardDataType === 'String') {
                this.ValueStringId = $($(tr).children()[1]).attr('id')
            }
            else {
                this.ValueIntegerId = $($(tr).children()[1]).attr('id')
            }
        }
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

    var dataConnectionTable = []
    let tr = $('tbody tr')
    for (let i = 0; i < tr.length; i++) {
        if (!$(tr[i]).attr('hidden')) {
            dataConnectionTable.push(new ConnectionTable(tr[i]))
        }
    }

    let card = {
        NumberVersion: getData('#cardVersion'),
        CardId: getData('#idCard'),
        Name: $('#name').val(),
        Status: $('#status').val()
    }
    if (card.Name === '') alert('Введите название карточки')
    else if (card.Name !== '' && confirm) alert('Заполните поля карточки')
    else $.ajax({
        type: "PATCH",
        url: "/api/card/patch",
        data: {
            accountCard: card,
            fieldsCards: dataField,
            fieldsCardsValues: dataValue,
            connectionTables: dataConnectionTable
        },
        dataType: "json",
        success: function (response) {
            if (typeof (response.message) === 'string')
                alert(response.message)
            else {
                validateField(response.message)
            }
        }
    });
});

$('#patch').click(function (e) {
    e.preventDefault();

    $('#data-container').empty();

    createDeleteButtons()

    let inputGroupName = createElement({ tag: 'div', class: 'input-group mb-3 mt-3' })
    createInputGroup(inputGroupName, 'Название карточки', 'name')

    let label = createElement({ tag: 'label', text: 'Статус текущей карточки' })

    let inputStatus = createElement({ tag: 'select', class: 'form-select mb-3', id: 'status' })

    let optionStatus1 = createElement({ tag: 'option', text: 'Актуальна', value: 'Actual' })
    optionStatus1.selected = true
    let optionStatus2 = createElement({ tag: 'option', text: 'Не актуальна', value: 'Not actual' })

    inputStatus.append(optionStatus1)
    inputStatus.append(optionStatus2)

    let sendButton = createElement({ tag: 'button', class: 'btn btn-primary mb-3', id: 'sendPatch', text: 'Отправить' })

    $(this).remove();
    $('#field-container').prop('hidden', false)
    $('#data-container').append(inputGroupName);
    $('#data-container').append(label)
    $('#data-container').append(inputStatus);
    $('#data-container').append(sendButton);
})

function createInputGroup(inputGroup, nameText, idInput) {
    let inputGroupPrepend = createElement({ tag: 'div', class: 'input-group-prepend' })
    inputGroup.append(inputGroupPrepend);

    let inputGroupText = createElement({ tag: 'span', class: 'input-group-text', id: 'basic-addon3', text: nameText })
    inputGroupPrepend.append(inputGroupText);

    let input = createElement({ tag: 'input', class: 'form-control', id: idInput })
    $(inputGroup).append(input);
    $(input).attr('aria-describedby', 'basic-addon3');
}

function createDeleteButtons() {
    let tr = $('tbody tr')
    for (let i = 0; i < tr.length; i++) {
        let td = createElement({ tag: 'td' })
        let deleteButton = createElement({ tag: 'button', class: 'btn btn-outline-danger btn-sm', id: 'deleteField', text: 'Удалить поле' })
        $(tr[i]).append(td)
        $(td).append(deleteButton)
    }
    let th = createElement({ tag: 'th', class: 'link-dark', id: 'recoverField', text: 'Восстановить поля' })
    $('thead tr').append(th)
}

$(document).on('click', '#deleteField', function () {
    if ($(this).parent().parent().is('tr'))
        $(this).parent().parent().prop('hidden', true)
})

$(document).on('click', '#recoverField', function () {
    $('tbody tr').prop('hidden', false)
})