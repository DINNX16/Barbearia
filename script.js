document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.querySelector('.dropdown-menu').style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', function() {
            this.querySelector('.dropdown-menu').style.display = 'none';
        });
    });
});

        // Função para abrir o menu
        function openNav() {
            document.getElementById("myNav").style.width = "25%";
        }

        // Função para fechar o menu
        function closeNav() {
            document.getElementById("myNav").style.width = "0";
        }