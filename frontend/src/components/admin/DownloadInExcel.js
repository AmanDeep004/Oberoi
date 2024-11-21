import * as XLSX from 'xlsx'; // Correct the import for xlsx
import { saveAs } from 'file-saver';

// Function to format date in readable format
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
};

const DownloadInExcel = async (bookingUsers) => {
    const worksheetData = await Promise.all(
        bookingUsers.map(async (user) => ({
            Name: user?.name,
            Email: user?.email,
            Phone: user?.phone,
            HotelId: user?.hotelId,
            HotelName: user?.hotelName,
            HotelContactInfo: `Room: ${user?.contactInfo?.room?.contactNo}, Restaurant: ${user?.contactInfo?.restaurant?.contactNo}, Banquet: ${user?.contactInfo?.banquet?.contactNo}`,
            VisitedAt: formatDate(user?.createdAt),
            UTMSource: user?.utmFields?.utmSource || 'n/a',
            UTMCampaign: user?.utmFields?.utmCampaign || 'n/a',
            UTMMedium: user?.utmFields?.UTMMedium || 'n/a',
            Browser: user?.browserData?.browser || 'n/a',
            OperatingSystem: user?.browserData?.os || 'n/a',
            Location: `Latitude: ${user?.browserData?.location?.latitude || 'n/a'}, Longitude: ${user?.browserData?.location?.longitude || "n/a"}`,
            Ip: user?.browserData?.ip || 'n/a',
            UserJourney: user?.userJourney?.join(" ---> ") || 'n/a',
            TimeSpent: `${user?.totalTimeSpent} min`,
            "PlanMyEvent(Clicked)": user?.planMyEventClicked ? 'yes' : 'no',
            "PlanMyEvent(Submitted)": user?.planMyEventSubmitted ? 'yes' : 'no',
        }))
    );

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BookingUsers');

    // Generate a binary string representation of the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the Excel file
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Use FileSaver to save the file
    saveAs(blob, 'booking_users.xlsx');
};

export default DownloadInExcel;
