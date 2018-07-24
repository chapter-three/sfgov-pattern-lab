"use strict";(function ($) {
    $().ready(function () {
        /*
                            * Iterate though navItems and check if it is in the href.
                            * If yes, then add is-active class to corresponding menu link.
                            */
        var href = document.location.href.toLowerCase();
        var navItems = ["services", "departments"];

        for (var i = 0, l = navItems.length; i < l; i++) {
            var nav = navItems[i];
            if (new RegExp("/" + nav).test(href)) {
                $('.sfgov-main-navigation ul.menu a[data-drupal-link-system-path=' + nav + ']').addClass('is-active');
                break;
            };
        };
    });
})(jQuery);
'use strict';(function ($) {
    $().ready(function () {
        /*
                            * Default open the first detail dropdown
                            */
        $('details:first-of-type').attr('open', true);
    });
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjAyLW5hdnMvMDEtbWFpbi1uYXZpZ2F0aW9uLmpzIiwiMDMtZm9ybXMvMDItZGV0YWlscy5qcyJdLCJuYW1lcyI6WyIkIiwicmVhZHkiLCJocmVmIiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsInRvTG93ZXJDYXNlIiwibmF2SXRlbXMiLCJpIiwibCIsImxlbmd0aCIsIm5hdiIsIlJlZ0V4cCIsInRlc3QiLCJhZGRDbGFzcyIsImpRdWVyeSIsImF0dHIiXSwibWFwcGluZ3MiOiJhQUFBLENBQUMsVUFBU0EsQ0FBVCxFQUFXO0FBQ1JBLFFBQUlDLEtBQUosQ0FBVSxZQUFVO0FBQ2hCOzs7O0FBSUEsWUFBSUMsT0FBT0MsU0FBU0MsUUFBVCxDQUFrQkYsSUFBbEIsQ0FBdUJHLFdBQXZCLEVBQVg7QUFDQSxZQUFJQyxXQUFXLENBQUMsVUFBRCxFQUFhLGFBQWIsQ0FBZjs7QUFFQSxhQUFLLElBQUlDLElBQUUsQ0FBTixFQUFTQyxJQUFFRixTQUFTRyxNQUF6QixFQUFpQ0YsSUFBRUMsQ0FBbkMsRUFBc0NELEdBQXRDLEVBQTJDO0FBQ3ZDLGdCQUFJRyxNQUFNSixTQUFTQyxDQUFULENBQVY7QUFDQSxnQkFBSSxJQUFJSSxNQUFKLENBQVcsTUFBSUQsR0FBZixFQUFvQkUsSUFBcEIsQ0FBeUJWLElBQXpCLENBQUosRUFBbUM7QUFDL0JGLGtCQUFFLG1FQUFpRVUsR0FBakUsR0FBcUUsR0FBdkUsRUFBNEVHLFFBQTVFLENBQXFGLFdBQXJGO0FBQ0E7QUFDSDtBQUNKO0FBQ0osS0FmRDtBQWdCSCxDQWpCRCxFQWlCR0MsTUFqQkg7YUNBQSxDQUFDLFVBQVNkLENBQVQsRUFBVztBQUNSQSxRQUFJQyxLQUFKLENBQVUsWUFBVTtBQUNoQjs7O0FBR0FELFVBQUUsdUJBQUYsRUFBMkJlLElBQTNCLENBQWdDLE1BQWhDLEVBQXdDLElBQXhDO0FBQ0gsS0FMRDtBQU1ILENBUEQsRUFPR0QsTUFQSCIsImZpbGUiOiJjb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpe1xuICAgICQoKS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAvKlxuICAgICAgICAgKiBJdGVyYXRlIHRob3VnaCBuYXZJdGVtcyBhbmQgY2hlY2sgaWYgaXQgaXMgaW4gdGhlIGhyZWYuXG4gICAgICAgICAqIElmIHllcywgdGhlbiBhZGQgaXMtYWN0aXZlIGNsYXNzIHRvIGNvcnJlc3BvbmRpbmcgbWVudSBsaW5rLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGhyZWYgPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHZhciBuYXZJdGVtcyA9IFtcInNlcnZpY2VzXCIsIFwiZGVwYXJ0bWVudHNcIl07XG5cbiAgICAgICAgZm9yICh2YXIgaT0wLCBsPW5hdkl0ZW1zLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuYXYgPSBuYXZJdGVtc1tpXTtcbiAgICAgICAgICAgIGlmIChuZXcgUmVnRXhwKFwiL1wiK25hdikudGVzdChocmVmKSl7XG4gICAgICAgICAgICAgICAgJCgnLnNmZ292LW1haW4tbmF2aWdhdGlvbiB1bC5tZW51IGFbZGF0YS1kcnVwYWwtbGluay1zeXN0ZW0tcGF0aD0nK25hdisnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfSlcbn0pKGpRdWVyeSk7IiwiKGZ1bmN0aW9uKCQpe1xuICAgICQoKS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAvKlxuICAgICAgICAgKiBEZWZhdWx0IG9wZW4gdGhlIGZpcnN0IGRldGFpbCBkcm9wZG93blxuICAgICAgICAgKi9cbiAgICAgICAgJCgnZGV0YWlsczpmaXJzdC1vZi10eXBlJykuYXR0cignb3BlbicsIHRydWUpO1xuICAgIH0pXG59KShqUXVlcnkpOyJdfQ==
