async function AJAXSubmit(onForm) {
    const formData = new FormData(onForm);
    try {
        const response = await fetch(onForm.action, {
            method: $(onForm).attr('method'),
            enctype: "multipart/form-data",
            body: formData
        });
        if (response.ok) {
            let resposeMessage = await response.text()
            alert(resposeMessage)
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}