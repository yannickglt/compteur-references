import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Checkbox, 
  Grid,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';

interface ExcelRow {
  id: number;
  col1: string;
  col2: string;
  col3: string;
  selected: boolean;
}

const App: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = useState<ExcelRow[]>([]);
  const [referenceCount, setReferenceCount] = useState<Record<string, number>>({});

  const calculateReferenceCounts = (rows: ExcelRow[]) => {
    const counts: Record<string, number> = {};
    rows.forEach(row => {
      if (row.selected) {
        counts[row.col3] = (counts[row.col3] || 0) + 1;
      }
    });
    setReferenceCount(counts);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      
      const planSheet = workbook.Sheets['Plan'];
      if (!planSheet) {
        alert('No "Plan" sheet found in the Excel file');
        return;
      }
      
      const jsonData = XLSX.utils.sheet_to_json(planSheet, { header: 1 }) as string[][];
      const processedData = jsonData.slice(2).map((row, index) => ({
        id: index,
        col1: row[0] || '',
        col2: row[1] || '',
        col3: row[2] || '',
        selected: false
      }));
      
      setData(processedData);
      calculateReferenceCounts(processedData);
    };
    
    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleCheckboxChange = (id: number) => {
    setData(prevData => {
      const newData = prevData.map(row => 
        row.id === id ? { ...row, selected: !row.selected } : row
      );
      calculateReferenceCounts(newData);
      return newData;
    });
  };

  const handleDownload = () => {
    // Create the content with tab separation
    const content = Object.entries(referenceCount)
      .map(([reference, count]) => `${reference}\t${count}`)
      .join('\n');
    
    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reference_counts.txt';
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box 
      sx={{ 
        p: 3, 
        height: '100vh',
        bgcolor: theme.palette.background.default
      }}
    >
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive 
            ? alpha(theme.palette.primary.main, 0.1)
            : theme.palette.background.paper,
          border: `2px dashed ${theme.palette.primary.main}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon 
          sx={{ 
            fontSize: 64, 
            color: theme.palette.primary.main,
            mb: 3 
          }} 
        />
        <Typography variant="h4" gutterBottom sx={{ fontSize: '2rem' }}>
          {isDragActive
            ? 'Déposez votre fichier Excel ici'
            : 'Glissez-déposez votre fichier Excel ici'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '1.25rem' }}>
          ou cliquez pour sélectionner un fichier
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2" sx={{ fontSize: '1.5rem' }}>
                Données des Supports
              </Typography>
              <Tooltip title="Sélectionnez les lignes pour compter leurs références">
                <IconButton size="large" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Box>
            <TableContainer>
              <Table 
                size="medium"
                sx={{
                  '& .MuiTableCell-root': {
                    py: 2,
                    fontSize: '1.1rem'
                  },
                  '& .MuiTableHead-root .MuiTableCell-root': {
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width={60}>Sélection</TableCell>
                    <TableCell>Support N°</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Symbole</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow 
                      key={row.id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': {
                          bgcolor: alpha(theme.palette.action.hover, 0.05)
                        }
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={row.selected}
                          onChange={() => handleCheckboxChange(row.id)}
                          inputProps={{ 'aria-label': `Select row ${row.id}` }}
                          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                      </TableCell>
                      <TableCell>{row.col1}</TableCell>
                      <TableCell>{row.col2}</TableCell>
                      <TableCell>{row.col3}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3,
              borderRadius: 2,
              position: 'sticky',
              top: 20,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            <Typography variant="h5" gutterBottom component="h2" sx={{ fontSize: '1.5rem' }}>
              Comptage des Références
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              {Object.entries(referenceCount).length > 0 ? (
                Object.entries(referenceCount).map(([reference, count]) => (
                  <Box 
                    key={reference}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': {
                        borderBottom: 'none'
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                      {reference}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: theme.palette.primary.main
                      }}
                    >
                      {count}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    textAlign: 'center', 
                    py: 3,
                    fontSize: '1.2rem'
                  }}
                >
                  Sélectionnez des lignes pour voir le comptage des références
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={Object.entries(referenceCount).length === 0}
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: '1.2rem',
                width: '100%'
              }}
            >
              Télécharger les Comptages
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App; 