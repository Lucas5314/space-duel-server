package com.lucas.spacetip.duel; // Cambia esto por el nombre de tu paquete real

import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.VideoView;
import androidx.appcompat.app.AppCompatActivity;

public class TrailerActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. Ocultar barras y forzar orientación Horizontal obligatoria
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

        // Cargar el diseño XML que acabamos de hacer
        setContentView(R.layout.activity_trailer);

        VideoView videoView = findViewById(R.id.videoViewTrailer);
        Button btnExit = findViewById(R.id.btnExitTrailer);

        // 2. Cargar tu video guardado en la carpeta res/raw/laught_trailer.mp4
        String videoPath = "android.resource://" + getPackageName() + "/" + R.raw.laught_trailer;
        videoView.setVideoURI(Uri.parse(videoPath));

        // 3. Reproducir en bucle automático sin controles de pausa o adelantar
        videoView.setOnPreparedListener(mp -> {
            mp.setLooping(true);
            videoView.start();
        });

        // 4. Bloquear cualquier toque en la pantalla para que no se pause por error
        videoView.setOnTouchListener((v, event) -> true);

        // 5. Botón de salir para cerrar el tráiler y volver a los settings
        btnExit.setOnClickListener(v -> finish());
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Asegurar que se mantenga en horizontal
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }
}