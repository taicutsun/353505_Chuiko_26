document.addEventListener('DOMContentLoaded', function(){
  try {
    // Read hidden DOM data elements and build a plain JS array
    const dataNodes = document.querySelectorAll('#contacts-data .contact-data');
    const contacts = Array.from(dataNodes).map(node => ({
        full_name: node.getAttribute('data-full_name') || '',
        photo: node.getAttribute('data-photo') || '',
        position: node.getAttribute('data-position') || '',
        phone: node.getAttribute('data-phone') || '',
        email: node.getAttribute('data-email') || '',
        description: node.getAttribute('data-description') || ''
    }));

    if (window.ContactsTable) {
      new ContactsTable({ data: contacts, perPage: 3 });
    }
  } catch (e) {
    console.error('contacts_init error', e);
  }
});
