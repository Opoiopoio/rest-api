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

    var data = []
    let tbody = $('tbody')
    for (let i = 0; i < tbody.length; i++) {
        let conTable = new ConnectionTable(tbody.children()[i])
        data.push(conTable)
    }
    console.log(data)

    let card = {
        NumberVersion: getData('#cardVersion'),
        CardId: getData('#idCard'),
        DateOfCreateVersion: null,
        Name: $('#name').val(),
        Status: 'Actual'
    }
    if (card.Name === '') alert('Введите название карточки')
    else $.ajax({
        type: "PATCH",
        url: "/rest-api/card/patch",
        data: {
            connectionTables: data, accountCard: card
        },
        dataType: "json",
        success: function (response) {
            alert(response.message)
        }
    });
});
function createElement(fieldNewElement) {
    let element = document.createElement(fieldNewElement.tag)
    if (fieldNewElement.class != undefined) element.className = fieldNewElement.class;
    if (fieldNewElement.id != undefined) element.id = fieldNewElement.id;
    if (fieldNewElement.text != undefined) element.textContent = fieldNewElement.text;
    if (fieldNewElement.type != undefined) element.type = fieldNewElement.type;
    return element
}

$('#patch').click(function (e) {
    e.preventDefault();

    $('#data-container').empty();

    let inputGroupName = createElement({ tag: 'div', class: 'input-group mb-3 mt-3' })
    generateInputGroup(inputGroupName, 'Название карточки', 'name')

    let sendButton = createElement({ tag: 'button', class: 'btn btn-primary', id: 'sendPatch', text: 'Отправить' })

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
