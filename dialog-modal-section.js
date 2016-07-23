/**
 * Make a section of a dialog modal
 *
 * When displaying a form in a modal dialog, dialogModalSection allows you to
 * display a sub-form inline with the rest of the form but in such a way that
 * the user's focus is solely on the sub-form.
 *
 * @author     Paul Rentschler <paul@rentschler.ws>
 * @since      22 July 2016
 * @license    MIT License
 */
(function (dialogModalSection, $, undefined)
{
    /**
     * Initalizes the dialogModalSection for use
     */
    dialogModalSection.init = function ()
    {
        /**
         * Display a subform as modal
         */
        $("[role='dms-subform-activate']").on(
            "click",
            function(event)
            {
                event.preventDefault();
                var $dialog = dialogModalSection._get_dialog($(this));
                var $subform = $($(this).attr("data-subform"));
                var $location = $($(this).attr("data-location"));
                dialogModalSection.subform_show($dialog, $subform, $location);
            }
        );


        /**
         * Hide the modal subform
         */
        $("[role='dms-subform-deactivate']").on(
            "click",
            function (event)
            {
                event.preventDefault();
                var $subform = $(this).closest("form");
                dialogModalSection.subform_hide($subform);
            }
        );
    }


    /**
     * Returns the dialog that contains the provided element
     */
    dialogModalSection._get_dialog = function (element)
    {
        return $(element).closest(".modal-dialog");
    }


    /**
     * Returns the subform storage element
     */
    dialogModalSection._get_subform_storage = function(dialog)
    {
        return $(dialog).find("[role='dms-subforms']");
    }


    /**
     * Returns the overlay object
     *
     * If the overlay already exists, it's returned. Otherwise a new one is
     * created.
     */
    dialogModalSection._get_or_create_overlay = function ()
    {
        var $overlay = $("#dms-overlay");
        if (!$overlay.length) {
            var $overlay = $("<div />").attr(
                "id",
                "dms-overlay"
            ).css({
                "background-color": "#000",
                "height": "100%",
                "left": 0,
                "position": "absolute",
                "top": 0,
                "width": "100%",
                "z-index": 2000,
                "opacity": 0,
            }).appendTo("body").hide();
        }
        return $overlay;
    }


    /**
     * Hide the subform within the dialog's form
     */
    dialogModalSection.subform_hide = function($subform)
    {
        var $dialog = $subform.closest(".modal-dialog");
        var $location = $($subform.attr("data-location"));
        var $overlay = dialogModalSection._get_or_create_overlay();
        var $section_wrapper = $subform.closest("[role='dms-wrapper']");
        var $storage = dialogModalSection._get_subform_storage($dialog);
        var $subform_wrapper = $subform.parent();

        $overlay.fadeTo(200, 0);
        $location.append(
            $subform_wrapper.css("padding", "15px 0")
        ).height("auto");
        $subform_wrapper.slideUp(400, function () {
          $overlay.hide();
          $section_wrapper.remove();
          $subform.appendTo($storage).show();
          $subform_wrapper.remove();
        });
    }


    /**
     * Show the subform within the dialog's form
     */
    dialogModalSection.subform_show = function($dialog, $subform, $location)
    {
        var $overlay = dialogModalSection._get_or_create_overlay();

        // store the location element for this subform
        $subform.attr("data-location", "#" + $location.attr("id"));

        // wrap the subform to provide a background and padding
        $subform_wrapper = $("<div />").css({
            "background-color": "#FFF",
            "padding": "15px 0"
        }).hide();
        $subform.show().appendTo($subform_wrapper);

        // add the wrapped subform to the dialog
        //   this makes room for it and provides the initial visualization
        //   of displaying the subform
        $subform_wrapper.appendTo($location);
        $subform_wrapper.slideDown(200, function () {
            // ensure the dialog doesn't collapse when the subform wrapper is
            //   pulled out
            $location.height(parseInt($subform_wrapper.height()) + 24);

            // determine the vertical offset needed
            var $element = $location;
            var vertical_offset = 0;
            while (2) {
                vertical_offset += $element.position().top;
                $element = $element.parent();
                if ($element.hasClass("modal-dialog")) {
                    break;
                }
            }

            // display the overlay
            $overlay.appendTo($dialog).show().height($dialog.height());
            $overlay.fadeTo(200, 0.5);

            // create a wrapper above the overlay
            var $section_wrapper = $("<div />").attr(
                "role",
                "dms-wrapper"
            ).css({
                "height": "100%",
                "left": 0,
                "position": "absolute",
                "top": 0,
                "width": "100%",
                "z-index": 2040,
                "opacity": 1,
                "filter": "alpha(opacity=100)"
            }).append(
                $("<div />").css({
                    "margin": "2px auto",
                    "padding-top": vertical_offset,
                    "z-index": 2050
                }).width(parseInt($dialog.width()) - 4).append(
                    $subform_wrapper.css("padding", 14)
                )
            ).appendTo($dialog);
        });
    }

}( window.dialogModalSection = window.dialogModalSection || {}, jQuery));


$(document).ready(function () {
    dialogModalSection.init();
});
