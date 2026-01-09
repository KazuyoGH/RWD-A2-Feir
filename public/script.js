// dashboard() hosts a lot of functionalities when the user lands on home, such as displaying the date, showing upcoming events, and showing the current user's events and classes.
async function dashboard() {
    dayjs.extend(window.dayjs_plugin_advancedFormat);
    const today = dayjs().format('MMMM Do, YYYY');
    document.querySelector('.date').textContent = today;
    const now = dayjs();

    const response = await fetch('/api/user');
    const userData = await response.json();

    const hour = dayjs().hour();
    let timeGreeting = "Good Morning,"
    if (hour >= 18)
        timeGreeting = "Good Evening,"
    else if (hour >= 12)
        timeGreeting = "Good Afternoon,"

    document.querySelector('.greetingname').textContent = userData.fname;
    document.querySelector('.greetingtime').textContent = timeGreeting;

    function getClosest(items) {
        return items
            .map(item => {
                const dateObj = dayjs(`${item.date || item.deadline} ${now.year()}`)
                const finalDate = dateObj.isBefore(now, 'day') ? dateObj.add(1, 'year') : dateObj;
                return { ...item, diff: finalDate.diff(now) };
            })
            .sort((a, b) => a.diff - b.diff)[0];
    }

    const closestEvent = getClosest(userData.events);
    const closestClass = getClosest(userData.classes);

    document.querySelector('.eventsDB').textContent = closestEvent?.title || "None";
    document.querySelector('.deadlineDB').textContent =
        closestClass ? `${closestClass.name} - ${closestClass.deadline}` : "None";

    const classesContainer = document.querySelector('.classesct');
    userData.classes.forEach(element => {
        classesContainer.innerHTML += `
            <div class="classitem">
                <div class="classname">${element.name}</div>
                <div class="classaction">
                    <div class="classrd">
                        <div class="title">Recent Deadline:</div>
                        <div class="crdcontent">${element.deadline}</div>
                    </div>
                    <div class="classrs">
                        <div class="title">Current Submitters:</div>
                        <div class="crscontent">${element.submitters}</div>
                    </div>
                </div>
            </div>
        `;
    });

    const eventsList = document.querySelector('.eventitems');
    userData.events.forEach(element => {
        eventsList.innerHTML += `
            <li>
                <div class="dateei">${element.date}</div>
                <div class="title">${element.title}</div>
            </li>
        `;
    });

    navigation();
}

// navigation() holds the interactivity of the navbar, glowing both the icon and the target, which whatever is linked with the icon.
function navigation() {
    const navItems = document.querySelectorAll('.nav-item');

    const eventContainer = document.querySelector('.eventbody'); 
    const classContainer = document.querySelector('.classesct');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));

            item.classList.add('active');

            if (item.id === 'navClasses') {
                eventContainer.classList.remove('section-highlight');
                classContainer.classList.add('section-highlight');

            } else if (item.id === 'navEvents') {
                eventContainer.classList.add('section-highlight');
                classContainer.classList.remove('section-highlight');

            } else if (item.id === 'navHome') {
                eventContainer.classList.remove('section-highlight');
                classContainer.classList.remove('section-highlight');
            }
        });
    });
}

// This listens for when the page starts loading content, when it does, then an overlay appears, and fades away as the main page "loads".
window.addEventListener('DOMContentLoaded', () => {
    dashboard();

    const overlay = document.getElementById('fadeOverlay');

    setTimeout(() => {
        overlay.classList.add('fadeOut');
        overlay.addEventListener('transitionend', () => {
            overlay.remove(); 
        });
    }, 800);
});