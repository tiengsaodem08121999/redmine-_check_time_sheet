$(document).ready(function() {
    const API_KEY = '261a83492179548e45039abffc8f67434922744b';
    const PROJECT_NAME = 's7-ec-cube';
    const REDMINE_URL = 'https://tools.splus-software.com/redmine';

    $('#timeTrackingForm').on('submit', function(e) {
        e.preventDefault();
        getTimeEntries($('#date').val());
       
    });

    function getTimeEntries(date) {
        const selectedDate = date;
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        // Show loading state
        const button = $(this).find('button[type="submit"]');
        const spinner = button.find('.spinner-border');
        spinner.removeClass('d-none');
        button.prop('disabled', true);
        $('#result').html('<div class="alert alert-info">Loading...</div>');

        // Make the API call using JSONP
        $.ajax({
            url: `${REDMINE_URL}/time_entries.json`,
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
                project_id: PROJECT_NAME,
                spent_on: selectedDate,
                key: API_KEY
            },
            success: function(response) {
                displayResults(response);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                $('#result').html(`
                    <div class="alert alert-danger">
                        <h4>Error</h4>
                        <p>Failed to fetch data from Redmine. Please try again later.</p>
                        <p>Error details: ${error}</p>
                    </div>
                `);
            },
            complete: function() {
                // Hide loading state
                spinner.addClass('d-none');
                button.prop('disabled', false);
            }
        });
    }
    function displayResults(data) {
        if (!data || !data.time_entries || data.time_entries.length === 0) {
            console.log('No time entries found for the selected date');
            return;
        }
        // Group entries by user
        const userGroups = {};

        data.time_entries.forEach(entry => {
            const userName = entry.user ? entry.user.name : 'Unknown';
            if (!userGroups[userName]) {
                userGroups[userName] = {
                    id: []
                };
            }
            userGroups[userName]['id'].push(entry.issue.id);
        });

        // Log grouped data to console
        console.log('Grouped Time Entries by User:', userGroups);
    }
}); 