<template>
    <div>
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link active" href="#">
                    <span data-feather="home"></span>
                    Dashboard <span class="sr-only">(current)</span>
                    </a>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/admin/ballots">
                    Ballots
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/admin/candidates">
                    Candidates
                    </router-link>
                </li>
                </ul>

                <!-- <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span><strong>模擬功能</strong></span>
                <a class="d-flex align-items-center text-muted" href="#">
                    <span data-feather="plus-circle"></span>
                </a>
                </h6> -->
                <ul class="nav flex-column mb-2">
                </ul>
            </div>
        </nav>
    </div>
</template>
<style scoped>
.router-link-active{
    opacity :1 ;
    visibility: visible;
    border-left-color: #4DB6AC;
    transition: all 0.25s;
}
</style>