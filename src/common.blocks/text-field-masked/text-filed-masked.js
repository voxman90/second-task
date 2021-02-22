const $textFields = $(".js-text-field-masked"),
      mask = "";
for (let $textField of $textFields) {
    mask = $textField.data(mask);
    $textField.mask(mask);
}

$.mask = {
    //
}