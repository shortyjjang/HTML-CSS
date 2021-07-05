// Review popup

$(function(){
    var $addReviewPopup = $('.popup.add_review')

    if(!$addReviewPopup.length) return;

    var lock;
    var fakeBlankImageSrc = $addReviewPopup.find('.photo').data('blankimage-src').trim()
    
    $addReviewPopup
        .on('open', function(){
            var $this = $(this), review = $(this).data('review'), sale_item_id = $(this).data('sale_item_id');
            $this
                .find("h3 > span").text( review?'Edit Review':'Write a Review').end()
                .find("[name=review_rate][data-review_rate="+(review&&review.rating||5)+"]").trigger('click').end()
                .find(".frm").data('sid', sale_item_id).end()
                .find(".review-body textarea").val(review&&review.body||'').end()
                .find(".review-body dd").removeClass('_need-more-chars').end()
                .find("#submit-review").data('editing', !!review).data('review-id', review&&review.id||null).end()
                .find(".photo a.image-file, .photo a.video-file").remove().end()
                .find("#review-file-upload").trigger('reset').end()

            if(review){
                var blankImg = $this.find(".photo").data('blankimage-src');
                if(review.images){
                    _.each(review.images, function(image){
                        $('<a href="#" class="image-file" data-review-image-id="'+image.id+'"><img src="'+blankImg+'" style="background-image:url(\''+image.thumbnail_url+'\')"></a>').insertBefore($this.find(".photo a.add"));
                    })
                }
                if(review.videos){
                    _.each(review.videos, function(video){
                        $('<a href="#" class="video-file" data-review-video-id="'+video.id+'"><video poster="'+video.thumbnail_url+'"><source src="'+video.original_url+'"></video></a>').insertBefore($this.find(".photo a.add"));
                    })
                }
            }else{
                $this.find(".review-body dd").addClass('_need-more-chars');
            }


        })
        // close popup
        .on('click', '.popup-close', function() {
            event.preventDefault()
            $.dialog('add_review').close()
        })
        // rating click (radio button)
        .on('click', '.review-rate-form input', function(event) {
            event.preventDefault()
            $addReviewPopup.find('.review-rate-form li.selected').removeClass('selected')
            $(this).closest('li').addClass('selected')
        })
        // rating click (container)
        .on('click', '.review-rate-form li', function(event) {
            event.preventDefault()
            var $el = $(this)
            $addReviewPopup.find('.review-rate-form li.selected').removeClass('selected')
            $el.addClass('selected')
            // Something is blocking input to be checked correctly, break context
            setTimeout(function(){ $el.find('input').prop('checked', true); }, 0);
        })
        // delegate click to file input to trigger file select dialog
        .on('click', '.photo', function() {
            setTimeout(function() {
                $('#review-file-upload').focus().trigger('click')
            }, 0)
            return false;
        })
        // load temporary upload image payload
        .on('change', '#review-file-upload', function() {
            if (!this.value) {
                return false;
            }
            var reader = new FileReader();
            var file = $('#review-file-upload').prop('files')[0]
            if (file.type.split('/')[0] == 'video') {
            if ($addReviewPopup.find('.photo video').length >= 2) {
                        alert('You cannot upload more than 2 videos per review.');
                return false;
            }
            var $video = $('<a href="#" class="video-file"><video><source src="' + URL.createObjectURL(file) + '"></video></a>');
            var vidEl = $video.find('video')[0];
            if (!vidEl.canPlayType(file.type) || vidEl.canPlayType(file.type) == "") {
                        alert("Unsupported media type : " + file.type);
                return false;
            }
            vidEl.addEventListener( "loadedmetadata", function (e) {
                if (this.videoHeight < 480 || this.videoWidth < 480) {
                alert("Minimum video resolution is 480p.");
                return false;
                }
                if (this.duration > 120) {
                alert("Maximum video length is 2 minutes.");
                return false;
                }
                        $video.data('file', file);
                        $video.data('filename', file.name);
                $video.load();
                        $addReviewPopup.find('.photo').prepend($video);
            }, false );
            } else {
            reader.onload = function(event) {
                        var $image = $('<a href="#" class="image-file"><img src="' + fakeBlankImageSrc + '" style="background-image:url(' + event.target.result + ')"></a>')
                        $image.data('file', file)
                        $image.data('filename', file.name)
                        $addReviewPopup
                .find('.photo')
                .prepend($image)
            };
            reader.readAsDataURL(file);
            }
        })
        // on review image click to delete
        .on('click', '.image-file', function(event) {
            var $el = $(this)
            if ($el.data('review-image-id') != null) {
                var $submitButton = $addReviewPopup.find('#submit-review')
                if ($submitButton.data('remove_images') != null) {
                    $submitButton.data('remove_images').push($el.data('review-image-id'))
                } else {
                    $submitButton.data('remove_images', [$el.data('review-image-id')])
                }
            }
            $el.data('file', null)
            $el.data('filename', null)
            $el.remove()
            $('#review-file-upload').val('');
            return false;
        })
        .on('click', '.video-file', function(event) {
            var $el = $(this)
            if ($el.data('review-video-id') != null) {
                var $submitButton = $addReviewPopup.find('#submit-review')
                if ($submitButton.data('remove_videos') != null) {
                    $submitButton.data('remove_videos').push($el.data('review-video-id'))
                } else {
                    $submitButton.data('remove_videos', [$el.data('review-video-id')])
                }
            }
            $el.data('file', null)
            $el.data('filename', null)
            $el.remove()
            return false;
        })
        // on review submission
        .on('click', '#submit-review', function(event) {
            event.preventDefault()
            if (lock) {
                return
            }
            lock = true
            var $el = $(this)
            $el.prop('disabled', true)
            function teardown(msg){
                if (msg) {
                    alert(msg);
                }
                lock = false;
                $el.prop('disabled', false);
            }

            var $selected = $addReviewPopup.find('.review-rate-form li.selected input');
            var rating = $selected.data('review_rate');
            if ($selected.length === 0 && rating == null) {
                return teardown('Please select review score.');
            } else if ($el.prop('disabled', true).attr('data-rating-noticed') !== 'true' && 1 <= rating && rating <= 3) {
                $el.prop('disabled', true).attr('data-rating-noticed', 'true')
                return teardown('It looks like you were not happy with this product. Please confirm your rating.');
            }

            var review_body = $addReviewPopup.find('.review-textarea').val()
            if (review_body.length < 100) {
                return teardown('Your review must be at least 100 characters.');
            }

            var formData = new FormData();
            formData.append('sale_item_id', $addReviewPopup.find('.frm').data('sid'))
            formData.append('rating', rating)
            formData.append('review_body', review_body)

            var tempImages = $addReviewPopup.find('.image-file')
            if (tempImages) {
                tempImages.each(function(i, e) {
                    formData.append('image', $(e).data('file'), $(e).data('filename'))
                })
            }

            var tempVideos = $addReviewPopup.find('.video-file')
            if (tempVideos) {
                tempVideos.each(function(i, e) {
                    formData.append('video', $(e).data('file'), $(e).data('filename'))
                })
            }

            var editing = $el.data('editing')
            if (editing) {
                var review_id = $el.data('review-id')
                formData.append('review_id', review_id)

                var remove_images = $el.data('remove_images')
                var remove_videos = $el.data('remove_videos')
                if (remove_images && remove_images.length > 0) {
                    formData.append('remove_images', remove_images.join(','))
                }
                if (remove_videos && remove_videos.length > 0) {
                    formData.append('remove_videos', remove_videos.join(','))
                }
            }
            var url = editing ? '/review_edit.json' : '/review_submit.json'

            $.ajax({
                url: url,
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false
            })
                .then(function(res) {
                    if (res.status_code === 0) {
                        alert('Failed to submit review. Please try again later.');
                        console.warn(res.message)
                    } else if (res.status_code === 1) {
                        $('.popup.add_review').addClass('done');
                    }
                })
                .fail(function() {
                    alert('Failed to submit review. Please try again later.');
                })
                .always(function() {
                    teardown();
                })
        })
        .on('click', '.success .buttons', function(){
            $.dialog('add_review').close();
            location.reload();
            return false;
        })
        // Review text character counting
        .on('keyup', '.review-body textarea', function() {
            var review_body = $addReviewPopup.find('.review-textarea').val().trim();
            var $byteEl = $('.review-body .byte');
            $byteEl.text(review_body.length - 100);
            if (review_body.length - 100 < 0) {
                $byteEl.closest('dd').addClass('_need-more-chars')
            } else {
                $byteEl.closest('dd').removeClass('_need-more-chars')
            }
        })

    $(document.body)
        // Open review edit/write popup
        .on('click', '.btn-review', function(event) {
            event.preventDefault()
            if (!$(this).hasClass('login-required')) {
                var review = $(this).data('review'), sale_item_id = $(this).data('sale_item_id');
                $.dialog('add_review').$obj.data('review', review||null).data('sale_item_id', sale_item_id||null);
                $.dialog('add_review').open()
            }
        })    
})
    