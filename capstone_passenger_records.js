"use strict";

const passengerRecords = [
  {
    pnrCode: "VN801",
    passengerName: "Nguyen Van An",
    idNumber: "001202012345",
    flightNumber: "VN240",
    seatNumber: "12A",
    isCheckedIn: true,
  },
  {
    pnrCode: "VN802",
    passengerName: "Tran Thi Mai",
    idNumber: "B1234567",
    flightNumber: "VN240",
    seatNumber: "12B",
    isCheckedIn: true,
  },
  {
    pnrCode: "VN803",
    passengerName: "Le Hoang Nam",
    idNumber: "036201009876",
    flightNumber: "VN240",
    seatNumber: null,
    isCheckedIn: false,
  },
];

const availableSeats = ["14A", "14B", "14C", "15A", "15B", "15C"];

const validateIdentityDocument = (id) => {
  if (typeof id !== "string") return false;
  const cleanId = id.trim().toUpperCase();

  const cccdRegex = /^[0-9]{12}$/;
  if (cccdRegex.test(cleanId)) return true;

  const passportRegex = /^[A-Z][0-9]{7,8}$/;
  if (passportRegex.test(cleanId)) return true;

  return false;
};

const findPassengerByPnr = (list, pnr) => {
  if (!pnr) return null;
  const targetPnr = pnr.trim().toUpperCase();
  for (let i = 0; i < list.length; i++) {
    if (list[i].pnrCode.toUpperCase() === targetPnr) {
      return list[i];
    }
  }
  return null;
};

const isSeatOccupied = (list, flightNumber, seatNumber) => {
  for (let i = 0; i < list.length; i++) {
    if (
      list[i].flightNumber === flightNumber &&
      list[i].seatNumber === seatNumber &&
      list[i].isCheckedIn
    ) {
      return true;
    }
  }
  return false;
};

const assignNextSeat = (list, flightNumber) => {
  for (let i = 0; i < availableSeats.length; i++) {
    const candidateSeat = availableSeats[i];
    if (!isSeatOccupied(list, flightNumber, candidateSeat)) {
      availableSeats.splice(i, 1);
      return candidateSeat;
    }
  }
  return null;
};

const printBoardingPass = (passenger) => {
  console.log(`
========================================================================================
|                                 BOARDING PASS / THẺ LÊN MÁY BAY                      |
========================================================================================
  HÀNH KHÁCH / PASSENGER  : ${passenger.passengerName.padEnd(25, " ")} CHUYẾN BAY / FLIGHT : ${passenger.flightNumber}
  MÃ ĐẶT CHỖ / PNR CODE   : ${passenger.pnrCode.padEnd(25, " ")} GHẾ / SEAT        : ${passenger.seatNumber}
  GIẤY TỜ / ID NUMBER     : ${passenger.idNumber.padEnd(25, " ")} TRẠNG THÁI        : CHECKED-IN
----------------------------------------------------------------------------------------
  MÃ VẠCH AN NINH (BARCODE): ||||| |||| || ||||||| ||||| ||| |||||| |||||| ||||||| |||||
========================================================================================`);
};

const listPassengerProfiles = (list) => {
  console.log(
    "====================================================================================================",
  );
  console.log(
    "|                                DANH SÁCH HỒ SƠ HÀNH KHÁCH VÀ AN NINH                             |",
  );
  console.log(
    "====================================================================================================",
  );
  console.log(
    "| Mã PNR | Họ và tên hành khách         | Giấy tờ tùy thân | Chuyến bay | Số ghế | Trạng thái      |",
  );
  console.log(
    "----------------------------------------------------------------------------------------------------",
  );

  for (let i = 0; i < list.length; i++) {
    const p = list[i];
    const pnr = p.pnrCode.padEnd(6, " ");
    const name = p.passengerName.padEnd(28, " ");
    const id = p.idNumber.padEnd(16, " ");
    const flight = p.flightNumber.padEnd(10, " ");
    const seat = (p.seatNumber || "Chưa có").padEnd(6, " ");
    const status = (p.isCheckedIn ? "ĐÃ CHECK-IN" : "CHƯA CHECK-IN").padEnd(
      15,
      " ",
    );

    console.log(
      `| ${pnr} | ${name} | ${id} | ${flight} | ${seat} | ${status} |`,
    );
  }

  console.log(
    "====================================================================================================",
  );
};

const registerNewPassenger = (list) => {
  const passengerName = prompt("Nhập họ tên hành khách:")?.trim();
  if (!passengerName) {
    alert("Họ tên không được để trống!");
    return;
  }

  const idNumber = prompt(
    "Nhập số CCCD (12 số) hoặc Hộ chiếu (1 chữ cái + 7-8 số):",
  )
    ?.trim()
    .toUpperCase();
  if (!validateIdentityDocument(idNumber)) {
    alert(
      "Giấy tờ không hợp lệ! CCCD phải đủ 12 chữ số, Hộ chiếu gồm 1 chữ cái và 7-8 số.",
    );
    return;
  }

  const flightNumber = prompt("Nhập số hiệu chuyến bay (ví dụ: VN240):")
    ?.trim()
    .toUpperCase();
  if (!flightNumber) {
    alert("Số hiệu chuyến bay không được để trống!");
    return;
  }

  const newPnr = `VN${String(800 + list.length + 1)}`;
  const newPassenger = {
    pnrCode: newPnr,
    passengerName: passengerName,
    idNumber: idNumber,
    flightNumber: flightNumber,
    seatNumber: null,
    isCheckedIn: false,
  };

  list.push(newPassenger);
  alert(`Tiếp nhận hồ sơ thành công! Mã PNR được cấp là: ${newPnr}`);
};

const processPassengerCheckIn = (list) => {
  const pnr = prompt("Nhập mã PNR để làm thủ tục check-in:")
    ?.trim()
    .toUpperCase();
  const passenger = findPassengerByPnr(list, pnr);

  if (!passenger) {
    alert(`Không tìm thấy hồ sơ hành khách với mã PNR: ${pnr}`);
    return;
  }

  if (passenger.isCheckedIn) {
    alert(
      `Hành khách ${passenger.passengerName} đã hoàn thành check-in tại ghế ${passenger.seatNumber}.`,
    );
    return;
  }

  const verifyId = prompt(
    `Xác thực an ninh: Nhập CCCD/Hộ chiếu đối chiếu cho PNR ${passenger.pnrCode}:`,
  )
    ?.trim()
    .toUpperCase();
  if (verifyId !== passenger.idNumber) {
    alert(
      "XÁC THỰC THẤT BẠI: Số giấy tờ tùy thân không khớp với hồ sơ lưu trữ!",
    );
    return;
  }

  const assignedSeat = assignNextSeat(list, passenger.flightNumber);
  if (!assignedSeat) {
    alert("Chuyến bay đã hết chỗ trống khả dụng để cấp tự động!");
    return;
  }

  passenger.seatNumber = assignedSeat;
  passenger.isCheckedIn = true;

  alert(
    `Check-in thành công cho khách hàng ${passenger.passengerName}. Ghế được cấp: ${assignedSeat}`,
  );
  printBoardingPass(passenger);
};

const runPassengerManagementCLI = () => {
  let menuChoice = "";
  do {
    menuChoice =
      prompt(`================ HỆ THỐNG AN NINH & CHECK-IN SÂN BAY ================
1. Xem danh sách hồ sơ hành khách
2. Tiếp nhận hồ sơ hành khách mới (Xác thực CCCD / Hộ chiếu)
3. Kiểm tra an ninh, cấp ghế tự động & Xuất Boarding Pass
4. Thoát chương trình
---------------------------------------------------------------------
Vui lòng nhập lựa chọn (1-4):`);

    switch (menuChoice) {
      case "1":
        listPassengerProfiles(passengerRecords);
        alert("Đã xuất danh sách hồ sơ ra tab Console (F12).");
        break;
      case "2":
        registerNewPassenger(passengerRecords);
        break;
      case "3":
        processPassengerCheckIn(passengerRecords);
        break;
      case "4":
        alert("Kết thúc phiên làm việc an ninh sân bay.");
        break;
      default:
        if (menuChoice !== null) {
          alert("Lựa chọn không hợp lệ, vui lòng chọn lại từ 1 đến 4!");
        }
        break;
    }
  } while (menuChoice !== "4" && menuChoice !== null);
};

runPassengerManagementCLI();
