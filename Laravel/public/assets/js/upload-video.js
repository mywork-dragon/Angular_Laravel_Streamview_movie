$(document).ready(function () {
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });
    $(".next-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);
    });
    $(".prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);
    });
});
function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}
/**
 * Function Name : saveVideoDetails()
 * To save first step of the job details
 * 
 * @var step        Step Position 1
 *
 * @return Json response
 */
function saveVideoDetails(step) {
   var title = $("#title").val();
   var datepicker = $("#datepicker").val();
   var duration = $("#duration").val();
   var rating5 = $("#rating5").val();
   var rating4 = $("#rating4").val();
   var rating3 = $("#rating3").val();
   var rating2 = $("#rating2").val();
   var rating1 = $("#rating1").val();
   var age = $("#age").val();
   var description = $("#description").val();
   var reviews = $("#reviews").val();
   var is_banner = $("#is_banner").val();
   if (title == '') {
        alert('Title Should not be blank');
        return false;
   }
   if (datepicker == '') {
        alert('Publish Time Should not be blank');
        return false;
   }
   if (duration == '') {
        alert('Duration Should not be blank');
        return false;
   }
   if (is_banner == 1) {
   } else {
       if(age == '') {
            // alert('Age Should not be blank');
            // return false;
       } else {
            // if (/^[0-9 +]+$/.test(age)) {
            // } else {
            //     $("#age").val("");
            //     alert("Age Wrong Format");
            //     return false;
            // }
       }
   }
  /* if (rating == '') {
        alert('Ratings Should not be blank');
        return false;
   }*/
   if (description == '') {
        alert('Description Should not be blank');
        return false;
   }
   if (reviews == '') {
        alert('Reviews Should not be blank');
        return false;
   }
   for (instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
    }
   $("#"+step).click();
}
/**
 * Function Name : saveCategory()
 * To save second step of the job details
 * 
 * @var category_id Category Id (Dynamic values)
 * @var step        Step Position 2
 *
 * @return Json response
 */
function saveCategory(category_id, step) {
    var categoryId = $("#category_id").val(category_id);
    $(".category_list").removeClass('active');
    $("#category_"+category_id).addClass('active');
    displaySubCategory(category_id, step);
}
/**
 * Function Name : displaySubCategory()
 * To Display all sub categories based on category id
 *
 * @var category_id    Selected Category id
 * 
 * @return Json Response
 */
function displaySubCategory(category_id='',step) {
     $("#sub_category").html("");
    if(category_id==''){
      var category_id = $("#category_id").val();  
    }
    // $("#sub_category").html("<p class='text-center'><i class='fa fa-spinner'></i></p>");
    $.ajax ({
        type : 'post',
        url : cat_url,
        data : {option: category_id},
        success : function(data) {
            $("#sub_category").html("");
            // console.log(data);return false;
            if (data == undefined) {
                alert("Oops Something went wrong. Kindly contact your administrator.");
                return false;
            }
            if (data.length == 0) {
                alert('No sub categories available. Kindly contact support team.');
                return false;
            }
            var subcategory = '';
            for(var i=0; i < data.length; i++) {
                var value = data[i];
                subcategory += "<option value='"+value.id+"'>"+value.name+"</option>";
                // subcategory += '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">'+
                //                     '<a class="category" onclick="saveSubCategory('+value.id+', '+step3+')">'+
                //                         '<div class="category-sec select-box sub_category_list" id="sub_category_'+value.id+'">'+
                //                             '  <div class="ribbon"><span><i class="fa fa-check"></i></span></div>'+
                //                             '<img src="'+value.picture+'" class="category-sec-img">'+
                //                         '</div><h4 class="category-sec-title">'+value.name+'</h4>'+
                //                     '</a>'+
                //                 '</div>';
            }
            $("#sub_category").append(subcategory);
            $("#sub_category").select2("destroy");
            setTimeout(function(){
                makeSelected();
                 $("#sub_category").select2();
            },1000);
            //$(".j-bs-wizard--action-btn-next").click();
        },
        error : function(data) {
            alert("Oops Something went wrong. Kindly contact your administrator.");
        }
    });
}
displaySubCategory();
/**
 * Function Name : saveSubCategory()
 * To save third step of the job details
 * 
 * @var sub_category_id     Sub Category Id (Dynamic values)
 * @var step                Step Position 3
 *
 * @return Json response
 */
function saveSubCategory(sub_category_id, step) {
    var subCategoryId = $("#sub_category_id").val(sub_category_id);
    $(".sub_category_list").removeClass('active');
    $("#sub_category_"+sub_category_id).addClass('active');
    $("#"+step).click();   
    // console.log(sub_cat_url);
    $.ajax ({
        type : 'post',
        url : sub_cat_url,
        data : {option: sub_category_id},
        success : function(data) {
            $('#genre').empty(); 
            $('#genre').append("<option value=''>Select genre</option>");
            // $("#trailer_video").attr('required', true);
            if(data.length != 0) {
                $("#genre_id").show();
                document.getElementById("genre").disabled=false;
                $("#genre").attr('required', true);
                // $("#trailer_video").attr('required', false);
            } else {
                $("#genre_id").hide();
                document.getElementById("genre").disabled=true;
                if (video_id) {
                    // $("#trailer_video").attr('required', false);
                }
            }
            $.each(data, function(index, element) {
                $('#genre').append("<option value='"+ element.id +"'>" + element.name + "</option>");
            });
        },
        error : function(data) {
            alert("Oops Something went wrong. Kindly contact your administrator.");
        }
    });
}
function loadGenre() {
    var subCategoryId = $("#sub_category_id").val();
    // var genre_id = $("#genre").val();
    console.log(subCategoryId);
    $.ajax ({
        type : 'post',
        url : sub_cat_url,
        data : {option: subCategoryId},
        success : function(data) {
            console.log(data);
            $('#genre').empty(); 
            $('#genre').append("<option value=''>Select genre</option>");
            if(data.length != 0) {
                $("#genre_id").show();
                document.getElementById("genre").disabled=false;
            } else {
                $("#genre_id").hide();
                document.getElementById("genre").disabled=true;
            }
            $.each(data, function(index, element) {
                $('#genre').append("<option value='"+ element.id +"'>" + element.name + "</option>");
            });
            $("#genre").val(genreId);
        },
        error : function(data) {
            alert("Oops Something went wrong. Kindly contact your administrator.");
        }
    });
}
var bar = $('.bar');
var percent = $('.percent');
var error = false;
$('form').ajaxForm({
    beforeSend: function(xhr,opts) {
        var title = $("#title").val();
        var poster = $("#poster").val();
        var age = $("#age").val();
        var trailer_duration = $("#trailer_duration").val();
        var duration = $("#duration").val();
        var description = $("#description").val();
        var ratings = $("input[name='ratings']:checked").val();
        var publish_type = $("input[name='publish_type']:checked").val();
        var datepicker = $("#datepicker").val();
        var details = $("#details").val();
        var category_id = $("#category_id").val();
        // var sub_category_id = $("#sub_category_id").val();
        var sub_category_id = $("#sub_category").val();
        var default_image =  document.getElementById("default_image").files.length;
        // var other_image1 =  document.getElementById("other_image1").files.length;
        // var other_image2 =  document.getElementById("other_image2").files.length;
        var err = '';
        if (title == '') {
            err = "Title should not be blank";
        }
        // if (age == '' && err == '') {
        //     err = "Age should not be blank";
        // }
        if (age != '' && err == '') {
            if (/^[0-9 +]+$/.test(age)) {
            } else {
                // $("#age").val("");
                // err = "Age wrong format..!";
            }
        }
        // if (trailer_duration == '' && err == '') {
        //     err = "Trailer Duration should not be blank";
        // }
        if (duration == '' && err == '') {
            err = "Duration should not be blank";
        }
        if (description == '' && err == '') {
            err = "Description should not be blank";
        }
        if ((ratings <= 0 || ratings == undefined) && err == '') {
            err = "Ratings should not be blank";
        }
        if (publish_type == 2 && datepicker == '' && err == '') {
            err = "Publish Time should not be blank";
        }
        // if (details == '' && err == '') {
        //     err = "Details should not be blank";
        // }
        if (category_id == '' && err == '') {
            err = "Selete any one of the category from the list.";
        }
        if (sub_category_id == '' && err == '') {
            err = "Selete any one of the sub category from the list.";
        }
        if (!video_id || video_id <= 0 || video_id == null) {
            if (default_image <= 0 && err == '' && poster=='') {
                err = "Please Choose Default Image.";
            }
            // if (other_image1 <= 0 && err == '') {
            //     err = "Please Choose first other Image.";
            // }
            // if (other_image2 <= 0 && err == '') {
            //     err = "Please Choose second other Image .";
            // }
        }
        if (err) {
            $("#error_messages_text").html(err);
            $("#error_popup").click();
            xhr.abort();
            return false;
        }
        $(".loader-form").show();
        var percentVal = '0%';
        bar.width(percentVal)
        percent.html(percentVal);
        $("#finish_video").text("Wait Progressing...");
        $("#finish_video").attr('disabled', true);
        $("#error_message").html("");
    },
    uploadProgress: function(event, position, total, percentComplete) {
        console.log("this is total", total);
        console.log(position);
        console.log(event);
        var percentVal = percentComplete + '%';
        bar.width(percentVal)
        percent.html(percentVal);
        if (percentComplete == 100) {
            $("#finish_video").text("Video Uploading...");
            $(".loader-form").show();
            $("#finish_video").attr('disabled', true);
        }
    },
    complete: function(xhr) {
        if(!error)  {
            bar.width("100%");
            percent.html("100%");
            $("#finish_video").text("Redirecting...");
            $("#finish_video").attr('disabled', true);
            console.log(error);
            console.log("complete"+xhr);
        } else {
            var percentVal = '0%';
            bar.width(percentVal);
            percent.html(percentVal);
        }
    },
    error : function(xhr) {
        $(".loader-form").fadeOut();
        $(".loader-form").css('display', 'none');
        $("#finish_video").text("Finish");
        $("#finish_video").attr('disabled', false);
        $("#error_messages_text").html("Upload: While Uploading Video some error occured. Please Try Again. Make sure upload file is meets with server upload limit.");
        $("#error_popup").click();
        error = true;
        return false;
        // console.log(xhr);
    },
    success : function(xhr) {
        $("#finish_video").text("Finish");
        $("#finish_video").attr('disabled', false);
        $(".loader-form").hide();
        if (xhr.response.success) {
            window.location.href= view_video_url+xhr.response.data.id;
        } else {
            error = true;
            $("#error_messages_text").html(xhr.response.error_messages);
            $("#error_popup").click();
            return false;
        }
    }
}); 
function loadFile(event, id){
    // alert(event.files[0]);
    var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById(id);
      // alert(output);
      output.src = reader.result;
       //$("#imagePreview").css("background-image", "url("+this.result+")");
    };
    reader.readAsDataURL(event.files[0]);
}
/**
 * Clear the selected files 
 * @param id
 */
function clearSelectedFiles(id) {
    e = $('#'+id);
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}
function checksrt(e,id) {
    console.log(e.files[0].type);
    console.log(e.files[0].type == '');
    if(e.files[0].type == "application/x-subrip" || e.files[0].type == '') {
    } else {
        alert("Please select '.srt' files");
        clearSelectedFiles(id);
    }
    return false;
}
