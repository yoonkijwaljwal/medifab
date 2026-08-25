$(function(){

    var bCheck1 = $('.xans-member').find('#check_method0');
    var bCheck2 = $('.xans-member').find('#check_method1');

    $(bCheck1).on('click', function() {

        if ($(this).prop('checked') == true) {
            $('.xans-member').find('.ssn_no').show();
            $('.xans-member').find('.email').hide();
        }
    });


    $(bCheck2).on('click', function() {

        if ($(this).prop('checked') == true) {
            $('.xans-member').find('.email').show();
            $('.xans-member').find('.ssn_no').hide();
        }
    });

    // 개인회원(indi)은 노출하지 않음 — 기본값을 남은 첫 옵션으로
    var $searchType = $('#searchType');
    if ($searchType.length) {
        var wasIndi = $searchType.val() === 'indi';
        $searchType.find('option[value="indi"]').remove();
        if (wasIndi || !$searchType.val()) {
            var first = $searchType.find('option').first().val();
            if (first) {
                $searchType.val(first);
            }
        }
        $searchType.trigger('change');
    }

});