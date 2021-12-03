const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'TRIPLET511_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $(".cd")
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $(".playlist")

const songlist = [
    {
        name: 'Tokyo Drift',
        singer: 'Teriyaki Boys',
        path: './musics/01.mp3',
        image: './img/1.jpg'
    },
    {
        name: 'Bài 2',
        singer: 'unknown',
        path: './musics/02.mp3',
        image: './img/2.jpg'
    },
    {
        name: 'Bài 3',
        singer: 'unknown',
        path: './musics/03.mp3',
        image: './img/3.jpg'
    },
    {
        name: 'Bai 4',
        singer: 'unknown',
        path: './musics/04.mp3',
        image: './img/4.jpg'
    },
]

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chúng Ta Của Hiện Tại',
            singer: 'Sơn Tùng M-TP',
            path: './musics/08.m4a',
            image: './img/7.jfif'
        },
        {
            name: 'Muộn Rồi Mà Sao Còn',
            singer: 'Sơn Tùng M-TP',
            path: './musics/07.m4a',
            image: './img/8.jfif'
        },
        {
            name: 'Tokyo Drift',
            singer: 'Teriyaki Boys',
            path: './musics/01.mp3',
            image: './img/1.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './musics/02.mp3',
            image: './img/2.jpg'
        },
        {
            name: 'Yêu Đừng Sợ Đau',
            singer: 'Ngô Lan Hương',
            path: './musics/03.mp3',
            image: './img/3.jpeg'
        },
        {
            name: 'Alone',
            singer: 'Marshmello',
            path: './musics/04.mp3',
            image: './img/4.jpg'
        },
        {
            name: 'Bước Qua Nhau',
            singer: 'Vũ',
            path: './musics/05.mp3',
            image: './img/5.jpg'
        },
        {
            name: 'Em Là Con Thuyền Cô Đơn',
            singer: 'Thái Học',
            path: './musics/06.mp3',
            image: './img/6.jpg'
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((item, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${item.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${item.name}</h3>
                    <p class="author">${item.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
        
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, // 10 seconds
            interations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ cd
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý play
        playBtn.onclick = () => {
             // Xử lý pause
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        
        // Khi song được play 
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const percent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = percent
            }
        }

        // Xử lý tua bài hát

        progress.onchange = function (e) {
            const seekTime = (e.target.value * audio.duration) / 100
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            }
            else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Khi prev bài hát
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            }
            else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Khi click random
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            btnRandom.classList.toggle('active', app.isRandom)
        }

        // Xử lý lặp lại một bài hát
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            btnRepeat.classList.toggle('active', app.isRepeat)
        }

        // Xử lý next bài hát khi audio ended
        audio.onended = function () {
            if (app.isRepeat) {
            audio.play() 
            } else
            btnNext.click()
        }

        // Lắng nghe hành vi khi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            
            // Xử lý khi click vào song
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                // Xử lý khi click vào song option
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            if (this.currentIndex < this.songs.length / 2) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }
            else {
                $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                })
            }
        }, 300)
    },
    loadCurrentSong: function () {
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    randomSong: function () {
        let newIndex = Math.floor(Math.random() * this.songs.length)
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    start: function () {
        // Gán cấu hình từ config vào app
        this.loadConfig()
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        // Lắng nghe và sử lý các sự kiện
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // Render playlist
        this.render()
        // HIển thị trạng thái ban đầu của cả hai button
        btnRandom.classList.toggle('active', app.isRandom)
        btnRepeat.classList.toggle('active', app.isRepeat)
    }
}

app.start()



