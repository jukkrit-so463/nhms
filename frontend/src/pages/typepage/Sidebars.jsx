import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faHouseChimney, faUsers, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ reloadTrigger }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [homeTypes, setHomeTypes] = useState([]);
  const [subunits, setSubunits] = useState({});
  const [homeUnits, setHomeUnits] = useState({});
  const [homeTypeUnits, setHomeTypeUnits] = useState({});
  const [openTypeId, setOpenTypeId] = useState(null);
  const [homeUnitsByType, setHomeUnitsByType] = useState({});
  const [unitHomeStats, setUnitHomeStats] = useState({});

  useEffect(() => {
    axios.get("http://localhost:3001/api/home_types")
      .then(res => setHomeTypes(res.data))
      .catch(() => setHomeTypes([]));
  }, []);

  // ดึง subunit_home ของแต่ละประเภทบ้าน
  useEffect(() => {
    async function fetchSubunitsAndUnits() {
      let subunitMap = {};
      let homeUnitMap = {};
      for (const type of homeTypes) {
        if (type.subunit_type) {
          // ดึง subunit_home ทั้งหมดของประเภทนี้
          const res = await axios.get(`http://localhost:3001/api/subunits/${type.subunit_type}`);
          subunitMap[type.id] = res.data;

          // ดึงจำนวนบ้าน (home_unit) ของแต่ละ subunit_home
          for (const subunit of res.data) {
            const huRes = await axios.get(`http://localhost:3001/api/home_units/${subunit.id}`);
            homeUnitMap[subunit.id] = huRes.data.length;
          }
        }
      }
      setSubunits(subunitMap);
      setHomeUnits(homeUnitMap);
    }
    if (homeTypes.length > 0) fetchSubunitsAndUnits();
  }, [homeTypes]);

  useEffect(() => {
    async function fetchUnits() {
      let typeUnitMap = {};
      for (const type of homeTypes) {
        // ดึง home_units ของแต่ละประเภท
        const res = await axios.get(`http://localhost:3001/api/home_units/${type.id}`);
        typeUnitMap[type.id] = res.data; // [{id, unit_name, ...}]
      }
      setHomeUnitsByType(typeUnitMap);
    }
    if (homeTypes.length > 0) fetchUnits();
  }, [homeTypes]);

  useEffect(() => {
    async function fetchUnitStats() {
      let stats = {};
      for (const type of homeTypes) {
        if (homeUnitsByType[type.id]) {
          for (const unit of homeUnitsByType[type.id]) {
            // ใช้ home_unit_id ในการดึงบ้านแต่ละ unit
            const res = await axios.get(`http://localhost:3001/api/homes?unit=${unit.id}`);
            const homes = res.data || [];
            const total = homes.length;
            const vacant = homes.filter(h => !h.guest_count || h.guest_count === 0).length;
            stats[unit.id] = { total, vacant };
          }
        }
      }
      setUnitHomeStats(stats);
    }
    fetchUnitStats();
  }, [homeTypes, homeUnitsByType, reloadTrigger]);

  const getHomeTypeIcon = (homeTypeName) => {
    switch(homeTypeName) {
      case 'บ้านพักแฝด':
        return faHouseChimney;
      case 'บ้านพักเรือนแถว':
        return faHome;
      case 'แฟลตสัญญาบัตร':
        return faBuilding;
      case 'บ้านพักลูกจ้าง':
        return faUsers;
      default:
        return faHome;
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const currentHomeType = searchParams.get('type');
  const currentPage = location.pathname.split('/').pop();

  const renderUnitStats = (unitId) => {
    const stats = unitHomeStats[unitId];
    if (!stats) return null;
    return (
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
        <div>ทั้งหมด: {stats.total} บ้าน</div>
        <div>ว่าง: {stats.vacant} บ้าน</div>
      </div>
    );
  };

  return (
    <div style={{ width: '305px', background: 'white', borderRight: '1px solid #e5e7eb', padding: '24px 0', minHeight: '100%' }}>
      <div style={{
        padding: '0 24px',
        marginBottom: '32px',
        borderBottom: '2px solid #f3f4f6',
        paddingBottom: '16px'
      }}>
        <h3 style={{
          color: '#374151',
          fontSize: '18px',
          fontWeight: 'bold',
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FontAwesomeIcon icon={faHome} style={{ color: '#6366f1' }} />
          เมนูหลัก
        </h3>
      </div>

      <nav>
        <button
          onClick={() => navigate("/home")}
          style={{
            width: '100%',
            padding: '12px 24px',
            border: 'none',
            background: currentPage === 'home' ? '#f0f7ff' : 'transparent',
            color: currentPage === 'home' ? '#2563eb' : '#6b7280',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderLeft: currentPage === 'home' ? '4px solid #2563eb' : '4px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '16px',
            fontWeight: currentPage === 'home' ? '600' : '500'
          }}
        >
          <FontAwesomeIcon icon={faHome} style={{ width: '16px', color: currentPage === 'home' ? '#2563eb' : '#9ca3af' }} />
          หน้าหลัก
        </button>
        {homeTypes.map(type => (
          <div key={type.id}>
            <button
              onClick={() => setOpenTypeId(openTypeId === type.id ? null : type.id)}
              style={{
                width: '100%',
                padding: '12px 24px',
                border: 'none',
                background: currentHomeType === type.name ? '#f0f7ff' : 'transparent',
                color: currentHomeType === type.name ? '#2563eb' : '#6b7280',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: currentHomeType === type.name ? '4px solid #2563eb' : '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                fontWeight: currentHomeType === type.name ? '600' : '500',
                position: 'relative'
              }}
            >
              <FontAwesomeIcon icon={getHomeTypeIcon(type.name)} style={{ width: '16px', color: currentHomeType === type.name ? '#2563eb' : '#9ca3af' }} />
              {type.name}
              <span style={{
                background: '#e0e7ef',
                borderRadius: '8px',
                padding: '2px 10px',
                marginLeft: 'auto',
                color: '#64748b',
                fontWeight: 500,
                fontSize: 16
              }}>
                {(homeUnitsByType[type.id]?.length || 0)} {type.subunit_type || "พื้นที่"}
              </span>
              <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: 8, fontSize: 12, transform: openTypeId === type.id ? 'rotate(180deg)' : 'none' }} />
            </button>
            {/* แสดงพื้นที่ 1 2 3 ... */}
            {openTypeId === type.id && homeUnitsByType[type.id] && (
              <div style={{ paddingLeft: 32, paddingTop: 4 }}>
                {homeUnitsByType[type.id].length === 0 ? (
                  <div style={{ color: "#9ca3af", fontSize: 13 }}>ไม่มีหน่วยบ้าน</div>
                ) : (
                  homeUnitsByType[type.id].map(unit => (
                    <button
                      key={unit.id}
                      onClick={() => navigate(`/homes?type=${type.name}&unit=${unit.id}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: '#374151',
                        fontSize: 16,
                        padding: '6px 0 6px 8px',
                        cursor: 'pointer',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{unit.unit_name}</span>
                      <span style={{
                        background: '#e0e7ef',
                        borderRadius: '8px',
                        padding: '2px 10px',
                        marginLeft: '8px',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: 15
                      }}>
                        {unitHomeStats[unit.id]
                          ? `จำนวน ${unitHomeStats[unit.id].total} หลัง ว่าง ${unitHomeStats[unit.id].vacant} หลัง`
                          : "-"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}