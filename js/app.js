// Dữ liệu danh sách phim mẫu
const moviesData = [
    {
        id: 1,
        title: "Inception",
        year: 2010,
        genres: ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
        rating: 8.8,
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
        description: "Một kẻ cắp thông tin xâm nhập vào giấc mơ của người khác để đánh cắp bí mật, nhận nhiệm vụ cấy một ý tưởng vào tâm trí của một CEO."
    },
    {
        id: 2,
        title: "Interstellar",
        year: 2014,
        genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Kịch tính"],
        rating: 8.6,
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80",
        description: "Một nhóm nhà hành tinh học du hành qua một lỗ sâu gần Sao Thổ để tìm kiếm một ngôi nhà mới cho nhân loại."
    },
    {
        id: 3,
        title: "The Dark Knight",
        year: 2008,
        genres: ["Hành động", "Tội phạm", "Kịch tính"],
        rating: 9.0,
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80",
        description: "Khi mối đe dọa từ Joker tàn phá thành phố Gotham, Batman phải chấp nhận một trong những bài kiểm tra tâm lý lớn nhất."
    },
    {
        id: 4,
        title: "Parasite",
        year: 2019,
        genres: ["Kịch tính", "Hài hước", "Tội phạm"],
        rating: 8.5,
        director: "Bong Joon Ho",
        cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
        poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80",
        description: "Gia đình nghèo thâm nhập vào cuộc sống của một gia đình giàu có bằng cách thâm nhập vào các vị trí làm việc tại nhà."
    },
    {
        id: 5,
        title: "Spirited Away",
        year: 2001,
        genres: ["Hoạt hình", "Phiêu lưu", "Gia đình"],
        rating: 8.6,
        director: "Hayao Miyazaki",
        cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
        description: "Cô bé Chihiro đi lạc vào thế giới của linh hồn và thần linh, phải tìm cách giải cứu cha mẹ đã bị biến thành heo."
    },
    {
        id: 6,
        title: "Avengers: Endgame",
        year: 2019,
        genres: ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
        rating: 8.4,
        director: "Anthony Russo, Joe Russo",
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
        poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80",
        description: "Các siêu anh hùng Avengers còn sống sót tập hợp lại để đảo ngược tác động khủng hoảng do Thanos gây ra."
    }
];

// Biến trạng thái toàn cục
let selectedGenres = [];
let searchQuery = "";

// Element Selectors
const movieGrid = document.getElementById("movieGrid");
const genreList = document.getElementById("genreList");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const movieCount = document.getElementById("movieCount");
const noResults = document.getElementById("noResults");
const themeToggle = document.getElementById("themeToggle");
const movieModal = document.getElementById("movieModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalBody = document.getElementById("modalBody");

// Khoát tạo ứng dụng
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    generateGenreCheckboxes();
    renderMovies();
    setupEventListeners();
});

// Bài 1 & 3: Xử lý Light/Dark Mode + Lưu localStorage
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Bài 2.2: Tự động trích xuất các Thể Loại duy nhất và sinh ra Checkbox
function generateGenreCheckboxes() {
    const allGenres = moviesData.flatMap(movie => movie.genres);
    const uniqueGenres = [...new Set(allGenres)].sort();

    genreList.innerHTML = uniqueGenres.map(genre => `
        <label class="checkbox-item">
            <input type="checkbox" value="${genre}" class="genre-checkbox">
            <span>${genre}</span>
        </label>
    `).join('');
}

// Bài 2.1: Hiển thị danh sách Phim ra DOM
function renderMovies() {
    const filteredMovies = filterMovies();

    movieCount.textContent = filteredMovies.length;

    if (filteredMovies.length === 0) {
        movieGrid.innerHTML = "";
        noResults.classList.remove("hidden");
        return;
    }

    noResults.classList.add("hidden");
    movieGrid.innerHTML = filteredMovies.map(movie => `
        <div class="movie-card" onclick="openModal(${movie.id})">
            <div class="poster-wrapper">
                <img src="${movie.poster}" alt="${movie.title}" class="poster-img" loading="lazy">
                <div class="movie-rating"><i class="fa-solid fa-star"></i> ${movie.rating}</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">${movie.year}</div>
                <div class="movie-genres">
                    ${movie.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Bài 2.4: Tư duy tích hợp Lọc thể loại VÀ Tìm kiếm đồng thời
function filterMovies() {
    return moviesData.filter(movie => {
        // Lọc theo thể loại
        const matchesGenre = selectedGenres.length === 0 || 
            selectedGenres.every(genre => movie.genres.includes(genre));

        // Lọc theo từ khóa tên phim
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesGenre && matchesSearch;
    });
}

// Bài 2.5: Kỹ thuật Debounce cho Search Input (300ms)
function debounce(func, delay = 300) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

// Sự kiện Lắng Nghe (Event Listeners)
function setupEventListeners() {
    // Sự kiện Checkbox Thể loại
    genreList.addEventListener("change", (e) => {
        if (e.target.classList.contains("genre-checkbox")) {
            const checkedBoxes = document.querySelectorAll(".genre-checkbox:checked");
            selectedGenres = Array.from(checkedBoxes).map(cb => cb.value);
            renderMovies();
        }
    });

    // Xử lý ô tìm kiếm với Debounce
    const handleSearch = debounce((e) => {
        searchQuery = e.target.value.trim();
        clearSearchBtn.style.display = searchQuery ? "block" : "none";
        renderMovies();
    }, 300);

    searchInput.addEventListener("input", handleSearch);

    // Xóa ô tìm kiếm
    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.style.display = "none";
        renderMovies();
    });

    // Nút đặt lại Bộ lọc
    resetFiltersBtn.addEventListener("click", () => {
        document.querySelectorAll(".genre-checkbox").forEach(cb => cb.checked = false);
        selectedGenres = [];
        searchInput.value = "";
        searchQuery = "";
        clearSearchBtn.style.display = "none";
        renderMovies();
    });

    // Đóng Modal
    closeModalBtn.addEventListener("click", closeModal);
    movieModal.addEventListener("click", (e) => {
        if (e.target === movieModal) closeModal();
    });
}

// Bài 3.1: Mở Modal Chi Tiết Phim
function openModal(id) {
    const movie = moviesData.find(m => m.id === id);
    if (!movie) return;

    modalBody.innerHTML = `
        <div class="modal-detail">
            <div class="modal-poster-wrapper">
                <img src="${movie.poster}" alt="${movie.title}" class="modal-poster">
            </div>
            <div class="modal-info">
                <h2 class="modal-title">${movie.title}</h2>
                <div class="modal-meta">
                    <span><i class="fa-solid fa-calendar"></i> ${movie.year}</span>
                    <span><i class="fa-solid fa-star" style="color:var(--star-color)"></i> ${movie.rating}/10</span>
                </div>
                <p class="modal-overview">${movie.description}</p>
                <div class="modal-credits">
                    <p><strong>Đạo diễn:</strong> ${movie.director}</p>
                    <p><strong>Diễn viên:</strong> ${movie.cast.join(", ")}</p>
                    <p><strong>Thể loại:</strong> ${movie.genres.join(", ")}</p>
                </div>
            </div>
        </div>
    `;

    movieModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Chống cuộn trang khi mở modal
}

function closeModal() {
    movieModal.classList.add("hidden");
    document.body.style.overflow = "auto";
}
