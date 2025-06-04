
    let currentData = null;

    // Enhanced Enter key functionality
    document.getElementById('tiktokUrl').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('downloadBtn').click();
        this.blur();
      }
    });

    // Premium number formatting
    function formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    }

    // Ultra Premium Image Lightbox Functions
    function openLightbox(imageSrc) {
      const lightbox = document.getElementById('lightboxOverlay');
      const lightboxImage = document.getElementById('lightboxImage');
      
      lightboxImage.src = imageSrc;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const lightbox = document.getElementById('lightboxOverlay');
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Close lightbox when clicking outside the image
    document.getElementById('lightboxOverlay').addEventListener('click', function(e) {
      if (e.target === this) {
        closeLightbox();
      }
    });

    // Ultra Premium Alert Function
    function showAlert() {
      const alertModal = document.getElementById('alertModal');
      alertModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeAlert() {
      const alertModal = document.getElementById('alertModal');
      alertModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      
      // Focus on input after closing alert
      document.getElementById('tiktokUrl').focus();
    }

    // Close alert when clicking outside
    document.getElementById('alertModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeAlert();
      }
    });

    // Enhanced keyboard controls
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightboxOverlay');
        const alertModal = document.getElementById('alertModal');
        const authorModal = document.getElementById('authorModal');
        
        if (lightbox.style.display === 'flex') {
          closeLightbox();
        } else if (alertModal.style.display === 'flex') {
          closeAlert();
        } else if (authorModal.style.display === 'flex') {
          closeAuthorModal();
        }
      }
    });

    function showAuthorModal() {
      if (!currentData || !currentData.author) {
        showAlert();
        return;
      }

      const modal = document.getElementById('authorModal');
      const data = currentData;

      // Populate modal with enhanced author data
      document.getElementById('authorAvatar').src = data.author.avatar;
      document.getElementById('authorName').textContent = data.author.nickname;
      document.getElementById('authorUsername').textContent = '@' + data.author.unique_id;
      document.getElementById('viewCount').textContent = formatNumber(data.view || 0);
      document.getElementById('commentCount').textContent = formatNumber(data.comment || 0);
      document.getElementById('shareCount').textContent = formatNumber(data.share || 0);
      document.getElementById('downloadCount').textContent = formatNumber(data.download || 0);

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeAuthorModal() {
      const modal = document.getElementById('authorModal');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }

    // Enhanced modal controls
    document.getElementById('authorModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeAuthorModal();
      }
    });

    async function download() {
      const url = document.getElementById('tiktokUrl').value.trim();
      const mediaResult = document.getElementById('mediaResult');
      const actionButtons = document.getElementById('actionButtons');
      const processingElement = document.getElementById('processing');

      mediaResult.innerHTML = '';
      actionButtons.innerHTML = '';
      actionButtons.style.display = 'none';
      processingElement.style.display = 'block';
      currentData = null;

      if (!url) {
        showAlert();
        processingElement.style.display = 'none';
        return;
      }

      try {
        const res = await fetch(`https://fastrestapis.fasturl.cloud/downup/mediadown?link=${encodeURIComponent(url)}`);
        const data = await res.json();
        const result = data.result?.data || {};
        
        currentData = result;

        const images = Array.isArray(result.images) ? result.images : [];
        const videoUrl = result.video;
        const audioUrl = result.audio;

        if (images.length > 0) {
          // Ultra Premium action buttons
          let buttonsHTML = '';
          if (audioUrl) {
            buttonsHTML += `
              <a class="action-btn" href="${audioUrl}" download>
                🎵 Download Audio
              </a>
            `;
          }
          buttonsHTML += `
            <button class="action-btn author-btn" onclick="showAuthorModal()">
              👤 Author Profile
            </button>
          `;
          actionButtons.innerHTML = buttonsHTML;
          actionButtons.style.display = 'flex';

          // Ultra Premium images display
          const mediaContainer = document.createElement('div');
          mediaContainer.className = 'media-container';
          
          const imagesGrid = document.createElement('div');
          imagesGrid.className = 'images-grid';
          
          images.forEach(imgUrl => {
            const image = document.createElement('img');
            image.src = imgUrl;
            image.alt = 'TikTok Image';
            image.onclick = () => openLightbox(imgUrl);
            imagesGrid.appendChild(image);
          });
          
          mediaContainer.appendChild(imagesGrid);
          mediaResult.appendChild(mediaContainer);

        } else if (videoUrl) {
          // Ultra Premium action buttons
          let buttonsHTML = '';
          if (audioUrl) {
            buttonsHTML += `
              <a class="action-btn" href="${audioUrl}" download>
                🎵 Download Audio
              </a>
            `;
          }
          buttonsHTML += `
            <button class="action-btn author-btn" onclick="showAuthorModal()">
              👤 Author Profile
            </button>
          `;
          actionButtons.innerHTML = buttonsHTML;
          actionButtons.style.display = 'flex';

          // Ultra Premium video display with thumbnail
          const mediaContainer = document.createElement('div');
          mediaContainer.className = 'media-container';
          
          const videoContainer = document.createElement('div');
          videoContainer.className = 'video-container';
          
          // Create video element
          const video = document.createElement('video');
          video.src = videoUrl;
          video.controls = true;
          video.style.display = 'none'; // Initially hidden
          
          // Create thumbnail overlay
          const thumbnailContainer = document.createElement('div');
          thumbnailContainer.className = 'video-thumbnail-container';
          
          const thumbnail = document.createElement('img');
          thumbnail.src = result.thumbnail || '/placeholder.svg?height=500&width=300';
          thumbnail.className = 'video-thumbnail';
          thumbnail.alt = 'Video Thumbnail';
          
          const playButton = document.createElement('div');
          playButton.className = 'video-play-button';
          playButton.innerHTML = '⏯';
          
          const videoInfo = document.createElement('div');
          videoInfo.className = 'video-info-overlay';
          videoInfo.innerHTML = `
            <div class="video-duration">${result.duration || 0}s</div>
            <div class="video-views">${formatNumber(result.view || 0)} views</div>
          `;
          
          // Add click event to show video
          thumbnailContainer.addEventListener('click', function() {
            thumbnailContainer.style.display = 'none';
            video.style.display = 'block';
            video.play();
          });
          
          thumbnailContainer.appendChild(thumbnail);
          thumbnailContainer.appendChild(playButton);
          thumbnailContainer.appendChild(videoInfo);
          
          videoContainer.appendChild(thumbnailContainer);
          videoContainer.appendChild(video);
          mediaContainer.appendChild(videoContainer);
          mediaResult.appendChild(mediaContainer);

        } else {
          mediaResult.innerHTML = '<div class="error-message">Media not available or invalid link provided.</div>';
        }

      } catch (error) {
        mediaResult.innerHTML = '<div class="error-message">An error occurred while fetching data. Please try again.</div>';
        console.error(error);
      } finally {
        processingElement.style.display = 'none';
      }
    }
